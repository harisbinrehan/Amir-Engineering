import { createClient } from "@/lib/supabase/server";

export type CatalogSortField = "name" | "price" | "stock" | "created_at";
export type CatalogSortDir = "asc" | "desc";
export type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";
export type StatusFilter = "all" | "active" | "inactive";

export type CatalogListOptions = {
  search?: string;
  categoryId?: string;
  status?: StatusFilter;
  stock?: StockFilter;
  minPrice?: number;
  maxPrice?: number;
  sort?: CatalogSortField;
  dir?: CatalogSortDir;
  page?: number;
  pageSize?: number;
};

const SORT_COLUMN: Record<CatalogSortField, string> = {
  name: "name",
  price: "price_from",
  stock: "total_stock",
  created_at: "created_at",
};

export async function getCatalogProducts(options: CatalogListOptions = {}) {
  const supabase = await createClient();
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 25));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("admin_product_catalog").select("*", { count: "exact" });

  if (options.search) {
    const term = options.search.trim();
    query = query.or(`name.ilike.%${term}%,sku_search.ilike.%${term}%`);
  }
  if (options.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options.status === "active") {
    query = query.eq("is_active", true);
  } else if (options.status === "inactive") {
    query = query.eq("is_active", false);
  }
  if (options.stock && options.stock !== "all") {
    query = query.eq("stock_status", options.stock);
  }
  if (typeof options.minPrice === "number") {
    query = query.gte("price_from", options.minPrice);
  }
  if (typeof options.maxPrice === "number") {
    query = query.lte("price_from", options.maxPrice);
  }

  const sortColumn = SORT_COLUMN[options.sort ?? "name"];
  query = query.order(sortColumn, { ascending: (options.dir ?? "asc") === "asc" }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  // Supabase's generated types mark every view column nullable (views don't
  // carry NOT NULL guarantees the way tables do) — id/name are never
  // actually null here since the view groups by products.id, a primary key.
  const rows = data as Array<
    (typeof data)[number] & {
      id: string;
      name: string;
      slug: string;
      is_active: boolean;
      is_featured: boolean;
      created_at: string;
      updated_at: string;
      variant_count: number;
      price_from: number;
      price_to: number;
      total_stock: number;
      stock_status: string;
    }
  >;

  return {
    rows,
    total: count ?? 0,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getProductAuditHistory(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*, actor:profiles(full_name)")
    .eq("entity_type", "product")
    .eq("entity_id", productId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}
