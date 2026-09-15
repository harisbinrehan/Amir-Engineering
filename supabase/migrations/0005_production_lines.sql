create table production_lines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  capacity text,
  required_space text,
  power_requirement text,
  brochure_url text,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_production_lines_slug on production_lines (slug) where deleted_at is null;

create trigger set_production_lines_updated_at
  before update on production_lines
  for each row execute procedure extensions.moddatetime(updated_at);

create table production_line_stages (
  id uuid primary key default gen_random_uuid(),
  production_line_id uuid not null references production_lines (id) on delete cascade,
  name text not null,
  description text,
  sort_order int not null default 0
);

create index idx_stages_line on production_line_stages (production_line_id);

-- media.id FK is added in 0010_media_audit_notifications.sql.
create table production_line_images (
  id uuid primary key default gen_random_uuid(),
  production_line_id uuid not null references production_lines (id) on delete cascade,
  media_id uuid,
  alt_text text,
  sort_order int not null default 0
);

create table production_line_machines (
  id uuid primary key default gen_random_uuid(),
  production_line_id uuid not null references production_lines (id) on delete cascade,
  machinery_id uuid not null references machinery (id) on delete restrict,
  stage_id uuid references production_line_stages (id) on delete set null,
  quantity int not null default 1,
  sort_order int not null default 0
);

create index idx_line_machines_line on production_line_machines (production_line_id);
create index idx_line_machines_machinery on production_line_machines (machinery_id);
