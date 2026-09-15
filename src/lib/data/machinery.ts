import { createClient } from "@/lib/supabase/server";

export async function getMachineryCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("machinery_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data;
}

export async function getMachineryCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("machinery_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return data;
}

export async function getMachineryList(options?: { categorySlug?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("machinery")
    .select("*, category:machinery_categories(id, name, slug)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("name");

  if (options?.categorySlug) {
    const category = await getMachineryCategoryBySlug(options.categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFeaturedMachinery(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("machinery")
    .select("*, category:machinery_categories(id, name, slug)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("name")
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getMachineryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("machinery")
    .select(
      `*,
      category:machinery_categories(id, name, slug),
      specifications:machinery_specifications(*),
      images:machinery_images(*)`,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRelatedMachinery(categoryId: string | null, excludeId: string, limit = 3) {
  if (!categoryId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("machinery")
    .select("*, category:machinery_categories(id, name, slug)")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(limit);

  if (error) throw error;
  return data;
}
