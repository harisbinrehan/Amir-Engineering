import { createClient } from "@/lib/supabase/server";

export async function getProductCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data;
}

export async function getProductCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return data;
}

export async function getProducts(options?: { categorySlug?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:product_categories(id, name, slug), variants:product_variants(*)")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("is_featured", { ascending: false })
    .order("name");

  if (options?.categorySlug) {
    const category = await getProductCategoryBySlug(options.categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:product_categories(id, name, slug), variants:product_variants(*)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .is("deleted_at", null)
    .order("name")
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, category:product_categories(id, name, slug), variants:product_variants(*), images:product_images(*)",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (data) {
    data.variants = [...data.variants]
      .filter((v) => v.is_active)
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }
  return data;
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:product_categories(id, name, slug), variants:product_variants(*)")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .neq("id", excludeId)
    .limit(3);

  if (error) throw error;
  return data;
}
