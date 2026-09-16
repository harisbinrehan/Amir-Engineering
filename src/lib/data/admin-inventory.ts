import { createClient } from "@/lib/supabase/server";

export async function getInventoryVariants(options?: { lowStockOnly?: boolean; search?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("product_variants")
    .select("*, product:products(id, name, slug, deleted_at)")
    .order("stock_quantity", { ascending: true });

  if (options?.search) {
    query = query.ilike("sku", `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  let rows = data.filter((v) => v.product && !v.product.deleted_at);
  if (options?.search) {
    const term = options.search.toLowerCase();
    rows = rows.filter(
      (v) => v.sku.toLowerCase().includes(term) || v.product?.name.toLowerCase().includes(term),
    );
  }
  if (options?.lowStockOnly) {
    rows = rows.filter((v) => v.stock_quantity <= v.low_stock_threshold);
  }

  return rows;
}

export async function getInventorySummary() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_variants").select("stock_quantity, low_stock_threshold");

  if (error) throw error;

  const totalUnits = data.reduce((sum, v) => sum + v.stock_quantity, 0);
  const lowStockCount = data.filter((v) => v.stock_quantity <= v.low_stock_threshold).length;
  const outOfStockCount = data.filter((v) => v.stock_quantity === 0).length;

  return { totalUnits, lowStockCount, outOfStockCount, variantCount: data.length };
}

export async function getVariantMovements(variantId: string, limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory_movements")
    .select("*")
    .eq("variant_id", variantId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
