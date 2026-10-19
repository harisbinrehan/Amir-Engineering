-- The view's security_invoker = true means it only shows ROWS the querying
-- user's own RLS already lets them see — but "public read active products"
-- means anon can see active rows, including exact total_stock figures this
-- view aggregates (which the public site never exposes, only an
-- in-stock/out-of-stock badge). Add an explicit staff-only gate so this
-- admin-only view can't leak exact inventory counts to anonymous visitors.
create or replace view admin_product_catalog
with (security_invoker = true) as
select
  p.id,
  p.name,
  p.slug,
  p.category_id,
  pc.name as category_name,
  p.base_price,
  p.currency,
  p.is_active,
  p.is_featured,
  p.image_url,
  p.created_at,
  p.updated_at,
  count(pv.id) as variant_count,
  coalesce(min(pv.price), p.base_price) as price_from,
  coalesce(max(pv.price), p.base_price) as price_to,
  coalesce(sum(pv.stock_quantity), 0) as total_stock,
  case
    when count(pv.id) = 0 then 'no_variants'
    when coalesce(sum(pv.stock_quantity), 0) = 0 then 'out_of_stock'
    when bool_or(pv.stock_quantity <= pv.low_stock_threshold) then 'low_stock'
    else 'in_stock'
  end as stock_status,
  coalesce(string_agg(distinct pv.sku, ' '), '') as sku_search
from products p
left join product_categories pc on pc.id = p.category_id
left join product_variants pv on pv.product_id = p.id
where p.deleted_at is null and is_staff()
group by p.id, pc.name;
