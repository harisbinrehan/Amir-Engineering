create table addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  label text,
  recipient_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  province text,
  postal_code text,
  country text not null default 'Pakistan',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_addresses_profile on addresses (profile_id);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  profile_id uuid references profiles (id) on delete set null,
  status order_status not null default 'pending',
  payment_method payment_method not null,
  payment_status payment_status not null default 'unpaid',
  shipping_address_id uuid references addresses (id) on delete set null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  subtotal numeric(12, 2) not null default 0,
  shipping_fee numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  tracking_number text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_profile on orders (profile_id);
create index idx_orders_status on orders (status);

create trigger set_orders_updated_at
  before update on orders
  for each row execute procedure extensions.moddatetime(updated_at);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  variant_id uuid not null references product_variants (id) on delete restrict,
  product_name text not null,
  variant_label text,
  quantity int not null check (quantity > 0),
  unit_price numeric(12, 2) not null,
  line_total numeric(12, 2) not null
);

create index idx_order_items_order on order_items (order_id);
