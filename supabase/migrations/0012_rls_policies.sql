-- Row Level Security: enabled on every table, default-deny. Only the policies
-- below grant access — a table with RLS enabled and no matching policy is
-- fully inaccessible to that operation/role.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;

create policy "users read own profile" on profiles
  for select using (id = auth.uid());

create policy "staff read all profiles" on profiles
  for select using (has_role(array['super_admin', 'admin']::app_role[]));

create policy "users update own profile" on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

-- Role changes only ever go through the update_user_role() RPC (0011),
-- which is security definer and checks super_admin itself — no direct
-- policy grants write access to the role column from the client.

-- ---------------------------------------------------------------------------
-- Public catalog: product_categories, products, product_variants, product_images
-- ---------------------------------------------------------------------------
alter table product_categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table inventory_movements enable row level security;

create policy "public read active product categories" on product_categories
  for select using (is_active = true);
create policy "staff manage product categories" on product_categories
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read active products" on products
  for select using (is_active = true and deleted_at is null);
create policy "staff manage products" on products
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read active variants" on product_variants
  for select using (
    is_active = true
    and exists (select 1 from products p where p.id = product_id and p.is_active and p.deleted_at is null)
  );
create policy "staff manage variants" on product_variants
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read product images" on product_images
  for select using (true);
create policy "staff manage product images" on product_images
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "staff manage inventory movements" on inventory_movements
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));
create policy "sales read inventory movements" on inventory_movements
  for select using (has_role(array['super_admin', 'admin', 'sales']::app_role[]));

-- ---------------------------------------------------------------------------
-- Machinery: machinery_categories, machinery, machinery_specifications, machinery_images
-- ---------------------------------------------------------------------------
alter table machinery_categories enable row level security;
alter table machinery enable row level security;
alter table machinery_specifications enable row level security;
alter table machinery_images enable row level security;

create policy "public read active machinery categories" on machinery_categories
  for select using (is_active = true);
create policy "staff manage machinery categories" on machinery_categories
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read active machinery" on machinery
  for select using (is_active = true and deleted_at is null);
create policy "staff manage machinery" on machinery
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read machinery specs" on machinery_specifications
  for select using (true);
create policy "staff manage machinery specs" on machinery_specifications
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read machinery images" on machinery_images
  for select using (true);
create policy "staff manage machinery images" on machinery_images
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

-- ---------------------------------------------------------------------------
-- Production lines
-- ---------------------------------------------------------------------------
alter table production_lines enable row level security;
alter table production_line_stages enable row level security;
alter table production_line_images enable row level security;
alter table production_line_machines enable row level security;

create policy "public read active production lines" on production_lines
  for select using (is_active = true and deleted_at is null);
create policy "staff manage production lines" on production_lines
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read production line stages" on production_line_stages
  for select using (true);
create policy "staff manage production line stages" on production_line_stages
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read production line images" on production_line_images
  for select using (true);
create policy "staff manage production line images" on production_line_images
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

create policy "public read production line machines" on production_line_machines
  for select using (true);
create policy "staff manage production line machines" on production_line_machines
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));

-- ---------------------------------------------------------------------------
-- Customers: addresses, orders, order_items
-- ---------------------------------------------------------------------------
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "customers manage own addresses" on addresses
  for all using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
create policy "staff manage all addresses" on addresses
  for all using (has_role(array['super_admin', 'admin', 'sales']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'sales']::app_role[]));

create policy "customers read own orders" on orders
  for select using (profile_id = auth.uid());
create policy "customers create own orders" on orders
  for insert with check (profile_id = auth.uid() or profile_id is null);
create policy "staff manage orders" on orders
  for all using (has_role(array['super_admin', 'admin', 'sales']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'sales']::app_role[]));
create policy "finance read orders" on orders
  for select using (has_role(array['finance']::app_role[]));

create policy "customers read own order items" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and o.profile_id = auth.uid())
  );
create policy "customers insert own order items" on order_items
  for insert with check (
    exists (select 1 from orders o where o.id = order_id and (o.profile_id = auth.uid() or o.profile_id is null))
  );
create policy "staff manage order items" on order_items
  for all using (has_role(array['super_admin', 'admin', 'sales']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'sales']::app_role[]));
create policy "finance read order items" on order_items
  for select using (has_role(array['finance']::app_role[]));

-- ---------------------------------------------------------------------------
-- Quotes: open guest submission, staff-managed thereafter
-- ---------------------------------------------------------------------------
alter table quotes enable row level security;
alter table quote_items enable row level security;
alter table quote_notes enable row level security;
alter table quote_status_history enable row level security;

create policy "anyone can submit a quote" on quotes
  for insert with check (true);
create policy "customers read own quotes" on quotes
  for select using (profile_id is not null and profile_id = auth.uid());
create policy "staff manage quotes" on quotes
  for all using (has_role(array['super_admin', 'admin', 'sales']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'sales']::app_role[]));

create policy "anyone can submit quote items" on quote_items
  for insert with check (
    exists (select 1 from quotes q where q.id = quote_id)
  );
create policy "customers read own quote items" on quote_items
  for select using (
    exists (select 1 from quotes q where q.id = quote_id and q.profile_id = auth.uid())
  );
create policy "staff manage quote items" on quote_items
  for all using (has_role(array['super_admin', 'admin', 'sales']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'sales']::app_role[]));

-- quote_notes are internal staff communication — never exposed to customers.
create policy "staff manage quote notes" on quote_notes
  for all using (has_role(array['super_admin', 'admin', 'sales']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'sales']::app_role[]));

create policy "staff read quote status history" on quote_status_history
  for select using (has_role(array['super_admin', 'admin', 'sales']::app_role[]));
create policy "customers read own quote status history" on quote_status_history
  for select using (
    exists (select 1 from quotes q where q.id = quote_id and q.profile_id = auth.uid())
  );
-- Inserts happen only via the trg_log_quote_status_change trigger (security definer).

-- ---------------------------------------------------------------------------
-- Finance: expense_categories, vendors, expenses — finance/admin/super_admin only
-- ---------------------------------------------------------------------------
alter table expense_categories enable row level security;
alter table vendors enable row level security;
alter table expenses enable row level security;

create policy "finance manage expense categories" on expense_categories
  for all using (has_role(array['super_admin', 'admin', 'finance']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'finance']::app_role[]));

create policy "finance manage vendors" on vendors
  for all using (has_role(array['super_admin', 'admin', 'finance']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'finance']::app_role[]));

create policy "finance manage expenses" on expenses
  for all using (has_role(array['super_admin', 'admin', 'finance']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'finance']::app_role[]));

-- ---------------------------------------------------------------------------
-- CMS: projects, project_images, blog_posts, testimonials, faqs, content_blocks, banners
-- ---------------------------------------------------------------------------
alter table projects enable row level security;
alter table project_images enable row level security;
alter table blog_posts enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table content_blocks enable row level security;
alter table banners enable row level security;

create policy "public read published projects" on projects
  for select using (is_published = true);
create policy "content staff manage projects" on projects
  for all using (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]));

create policy "public read project images" on project_images
  for select using (true);
create policy "content staff manage project images" on project_images
  for all using (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]));

create policy "public read published blog posts" on blog_posts
  for select using (is_published = true);
create policy "content staff manage blog posts" on blog_posts
  for all using (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]));

create policy "public read published testimonials" on testimonials
  for select using (is_published = true);
create policy "content staff manage testimonials" on testimonials
  for all using (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]));

create policy "public read published faqs" on faqs
  for select using (is_published = true);
create policy "content staff manage faqs" on faqs
  for all using (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]));

create policy "public read published content blocks" on content_blocks
  for select using (status = 'published');
create policy "content staff manage content blocks" on content_blocks
  for all using (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]));

create policy "public read active banners" on banners
  for select using (is_active = true);
create policy "content staff manage banners" on banners
  for all using (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]))
  with check (has_role(array['super_admin', 'admin', 'content_manager']::app_role[]));

-- ---------------------------------------------------------------------------
-- Media, audit logs, notifications
-- ---------------------------------------------------------------------------
alter table media enable row level security;
alter table audit_logs enable row level security;
alter table notifications enable row level security;

create policy "public read media" on media
  for select using (true);
create policy "staff manage media" on media
  for all using (is_staff())
  with check (is_staff());

create policy "admins read audit logs" on audit_logs
  for select using (has_role(array['super_admin', 'admin']::app_role[]));
-- audit_logs inserts are performed by server-side actions using the service
-- role key (bypasses RLS by design) — never by client-issued writes.

create policy "users read own notifications" on notifications
  for select using (recipient_id = auth.uid());
create policy "users update own notifications" on notifications
  for update using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());
create policy "staff manage notifications" on notifications
  for all using (has_role(array['super_admin', 'admin']::app_role[]))
  with check (has_role(array['super_admin', 'admin']::app_role[]));
