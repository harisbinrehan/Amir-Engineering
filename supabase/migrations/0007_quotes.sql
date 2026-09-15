create table quotes (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  status quote_status not null default 'new',
  full_name text not null,
  company_name text,
  email text not null,
  phone text not null,
  city text,
  country text default 'Pakistan',
  message text,
  estimated_price numeric(12, 2),
  quotation_pdf_url text,
  assigned_to uuid references profiles (id) on delete set null,
  profile_id uuid references profiles (id) on delete set null,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_quotes_status on quotes (status);
create index idx_quotes_assigned on quotes (assigned_to);
create index idx_quotes_profile on quotes (profile_id);

create trigger set_quotes_updated_at
  before update on quotes
  for each row execute procedure extensions.moddatetime(updated_at);

create table quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes (id) on delete cascade,
  machinery_id uuid references machinery (id) on delete set null,
  production_line_id uuid references production_lines (id) on delete set null,
  quantity int not null default 1,
  required_capacity text,
  customization_notes text,
  constraint chk_quote_item_target check (
    (machinery_id is not null)::int + (production_line_id is not null)::int = 1
  )
);

create index idx_quote_items_quote on quote_items (quote_id);

create table quote_notes (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes (id) on delete cascade,
  author_id uuid not null references profiles (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index idx_quote_notes_quote on quote_notes (quote_id);

create table quote_status_history (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes (id) on delete cascade,
  from_status quote_status,
  to_status quote_status not null,
  changed_by uuid references profiles (id) on delete set null,
  changed_at timestamptz not null default now()
);

create index idx_quote_status_history_quote on quote_status_history (quote_id);
