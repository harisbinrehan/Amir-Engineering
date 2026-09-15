create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role app_role not null default 'customer',
  full_name text,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_role on profiles (role);

-- Auto-create a profile row (default role: customer) whenever a new auth user signs up.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure extensions.moddatetime(updated_at);
