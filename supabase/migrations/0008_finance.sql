create table expense_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_person text,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

-- media.id FK is added in 0010_media_audit_notifications.sql.
create table expenses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references expense_categories (id) on delete set null,
  vendor_id uuid references vendors (id) on delete set null,
  description text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'PKR',
  expense_date date not null,
  payment_method text,
  department text,
  project text,
  notes text,
  receipt_media_id uuid,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_expenses_date on expenses (expense_date);
create index idx_expenses_category on expenses (category_id);
create index idx_expenses_vendor on expenses (vendor_id);

create trigger set_expenses_updated_at
  before update on expenses
  for each row execute procedure extensions.moddatetime(updated_at);
