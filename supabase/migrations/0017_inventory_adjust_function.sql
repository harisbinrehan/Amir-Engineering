-- Atomically adjusts a variant's stock and records the movement in one
-- round trip. security invoker (the default) — runs as the calling user, so
-- the existing RLS policies on product_variants / inventory_movements still
-- gate who can call this (staff only).
create or replace function adjust_variant_stock(
  p_variant_id uuid,
  p_change_qty int,
  p_reason text,
  p_created_by uuid
) returns product_variants
language plpgsql
as $$
declare
  v_variant product_variants;
begin
  update product_variants
  set stock_quantity = stock_quantity + p_change_qty
  where id = p_variant_id
  returning * into v_variant;

  if v_variant.id is null then
    raise exception 'Variant not found';
  end if;

  if v_variant.stock_quantity < 0 then
    raise exception 'Stock cannot go below zero';
  end if;

  insert into inventory_movements (variant_id, change_qty, reason, created_by)
  values (p_variant_id, p_change_qty, p_reason, p_created_by);

  return v_variant;
end;
$$;
