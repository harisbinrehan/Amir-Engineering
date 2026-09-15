create table product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references product_categories (id) on delete set null,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_product_categories_updated_at
  before update on product_categories
  for each row execute procedure extensions.moddatetime(updated_at);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references product_categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  base_price numeric(12, 2) not null default 0,
  currency text not null default 'PKR',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_by uuid references profiles (id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products (category_id) where deleted_at is null;
create index idx_products_slug on products (slug) where deleted_at is null;

create trigger set_products_updated_at
  before update on products
  for each row execute procedure extensions.moddatetime(updated_at);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  sku text not null unique,
  label text,
  price numeric(12, 2),
  weight_grams int,
  stock_quantity int not null default 0,
  low_stock_threshold int not null default 10,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_variants_product on product_variants (product_id);

create trigger set_product_variants_updated_at
  before update on product_variants
  for each row execute procedure extensions.moddatetime(updated_at);

-- media.id FK is added in 0010_media_audit_notifications.sql, once `media` exists.
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  media_id uuid,
  alt_text text,
  sort_order int not null default 0
);

create index idx_product_images_product on product_images (product_id);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references product_variants (id) on delete cascade,
  change_qty int not null,
  reason text not null,
  reference_id uuid,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_inventory_movements_variant on inventory_movements (variant_id);
