create table machinery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_machinery_categories_updated_at
  before update on machinery_categories
  for each row execute procedure extensions.moddatetime(updated_at);

create table machinery (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references machinery_categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  capacity text,
  power_requirement text,
  dimensions text,
  weight text,
  voltage text,
  material text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  brochure_url text,
  seo_title text,
  seo_description text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_machinery_category on machinery (category_id) where deleted_at is null;
create index idx_machinery_slug on machinery (slug) where deleted_at is null;

create trigger set_machinery_updated_at
  before update on machinery
  for each row execute procedure extensions.moddatetime(updated_at);

create table machinery_specifications (
  id uuid primary key default gen_random_uuid(),
  machinery_id uuid not null references machinery (id) on delete cascade,
  spec_group text not null default 'General',
  label text not null,
  value text not null,
  sort_order int not null default 0
);

create index idx_machinery_specs_machinery on machinery_specifications (machinery_id);

-- media.id FK is added in 0010_media_audit_notifications.sql, once `media` exists.
create table machinery_images (
  id uuid primary key default gen_random_uuid(),
  machinery_id uuid not null references machinery (id) on delete cascade,
  media_id uuid,
  alt_text text,
  sort_order int not null default 0
);

create index idx_machinery_images_machinery on machinery_images (machinery_id);
