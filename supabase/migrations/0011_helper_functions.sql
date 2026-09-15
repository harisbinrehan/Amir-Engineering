-- security definer avoids RLS recursion when policies on `profiles` itself
-- need to check the caller's role.
create function current_user_role()
returns app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from profiles where id = auth.uid();
$$;

create function is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('super_admin', 'admin', 'finance', 'sales', 'content_manager')
  );
$$;

create function has_role(roles app_role[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role = any(roles)
  );
$$;

-- Only a super_admin may change another user's role — never a raw client-side
-- `update profiles set role = ...`.
create function update_user_role(target_user_id uuid, new_role app_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user_role() <> 'super_admin' then
    raise exception 'Only a super_admin can change user roles';
  end if;

  update profiles set role = new_role where id = target_user_id;
end;
$$;

-- Bypasses RLS so the guest "insert quote_items for a quote I just created"
-- policy can confirm the parent quote exists — the inserting role (anon) has
-- no SELECT policy on `quotes` itself, so a plain EXISTS subquery in that
-- policy would always evaluate false.
create function quote_exists(target_quote_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from quotes where id = target_quote_id);
$$;

-- Same RLS-recursion problem as quote_exists(), for guest checkout order_items.
create function order_insertable(target_order_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from orders
    where id = target_order_id
      and (profile_id = auth.uid() or profile_id is null)
  );
$$;

-- Reference / order number generators (race-safe via sequences).
create sequence quote_reference_seq;
create function generate_quote_reference()
returns text
language plpgsql
as $$
declare
  n bigint;
begin
  n := nextval('quote_reference_seq');
  return 'QT-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 6, '0');
end;
$$;

create sequence order_number_seq;
create function generate_order_number()
returns text
language plpgsql
as $$
declare
  n bigint;
begin
  n := nextval('order_number_seq');
  return 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 6, '0');
end;
$$;

-- Records a quote_status_history row whenever quotes.status changes.
create function log_quote_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'UPDATE' and new.status is distinct from old.status) then
    insert into quote_status_history (quote_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger trg_log_quote_status_change
  after update on quotes
  for each row execute procedure log_quote_status_change();
