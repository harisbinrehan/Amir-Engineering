-- Storage bucket backing the `media` table (see 0010_media_audit_notifications.sql).
-- The table existed with RLS already in place (0012_rls_policies.sql) but had
-- no bucket to actually store files in — this migration adds it.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10 MiB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');

create policy "staff upload media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and is_staff());

create policy "staff update media bucket" on storage.objects
  for update using (bucket_id = 'media' and is_staff())
  with check (bucket_id = 'media' and is_staff());

create policy "staff delete media bucket" on storage.objects
  for delete using (bucket_id = 'media' and is_staff());
