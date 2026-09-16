create type contact_inquiry_status as enum ('new', 'read', 'resolved');

create table contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status contact_inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create index idx_contact_inquiries_status on contact_inquiries (status);

alter table contact_inquiries enable row level security;

-- Guest contact form: anyone can submit, matching the open quote-request
-- insert policy (mitigated client-side with a honeypot field, same pattern).
create policy "public insert contact inquiries" on contact_inquiries
  for insert with check (true);

create policy "staff manage contact inquiries" on contact_inquiries
  for all using (has_role(array['super_admin', 'admin', 'sales']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'sales']::app_role[]));
