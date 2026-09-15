create table media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  uploaded_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_media_bucket on media (bucket);

-- Forward FKs deferred from earlier migrations, now that `media` exists.
alter table product_images
  add constraint fk_product_images_media foreign key (media_id) references media (id) on delete set null;

alter table machinery_images
  add constraint fk_machinery_images_media foreign key (media_id) references media (id) on delete set null;

alter table production_line_images
  add constraint fk_production_line_images_media foreign key (media_id) references media (id) on delete set null;

alter table expenses
  add constraint fk_expenses_receipt_media foreign key (receipt_media_id) references media (id) on delete set null;

alter table project_images
  add constraint fk_project_images_media foreign key (media_id) references media (id) on delete set null;

alter table blog_posts
  add constraint fk_blog_posts_cover_media foreign key (cover_media_id) references media (id) on delete set null;

alter table banners
  add constraint fk_banners_media foreign key (media_id) references media (id) on delete set null;

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_entity on audit_logs (entity_type, entity_id);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  link_url text,
  created_at timestamptz not null default now()
);

create index idx_notifications_recipient on notifications (recipient_id, is_read);
