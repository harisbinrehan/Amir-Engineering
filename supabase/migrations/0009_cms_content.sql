create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client_name text,
  country text,
  city text,
  machinery_supplied text,
  production_capacity text,
  summary text,
  body text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_published on projects (is_published);

create trigger set_projects_updated_at
  before update on projects
  for each row execute procedure extensions.moddatetime(updated_at);

-- media.id FK is added in 0010_media_audit_notifications.sql.
create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  media_id uuid,
  caption text,
  sort_order int not null default 0
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  cover_media_id uuid,
  author_id uuid references profiles (id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_blog_posts_published on blog_posts (is_published);

create trigger set_blog_posts_updated_at
  before update on blog_posts
  for each row execute procedure extensions.moddatetime(updated_at);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  company_name text,
  quote text not null,
  rating int check (rating between 1 and 5),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table content_blocks (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  content jsonb not null default '{}'::jsonb,
  status content_block_status not null default 'published',
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger set_content_blocks_updated_at
  before update on content_blocks
  for each row execute procedure extensions.moddatetime(updated_at);

-- media.id FK is added in 0010_media_audit_notifications.sql.
create table banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  media_id uuid,
  link_url text,
  placement text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz
);
