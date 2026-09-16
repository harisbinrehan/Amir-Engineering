import { createClient } from "@/lib/supabase/server";

export async function getAdminProductCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_categories").select("*").order("sort_order");

  if (error) throw error;
  return data;
}

export async function getAdminProducts(options?: { categoryId?: string; search?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:product_categories(id, name, slug), variants:product_variants(*)")
    .is("deleted_at", null)
    .order("name");

  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAdminProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:product_categories(id, name, slug), variants:product_variants(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (data) {
    data.variants = [...data.variants].sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));
  }
  return data;
}
