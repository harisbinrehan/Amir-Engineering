-- Aggregated, admin-only view backing the advanced product listing: lets
-- search/filter/sort/pagination run as plain PostgREST queries instead of
-- fetching every product into the browser and filtering client-side.
-- security_invoker means it runs with the querying user's own RLS, not the
-- view owner's — so the existing products/product_variants policies still
-- gate access (this view adds no privilege of its own).
create view admin_product_catalog
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
  -- space-joined SKUs so a plain ilike search matches any variant's SKU
  coalesce(string_agg(distinct pv.sku, ' '), '') as sku_search
from products p
left join product_categories pc on pc.id = p.category_id
left join product_variants pv on pv.product_id = p.id
where p.deleted_at is null
group by p.id, pc.name;
