import { createClient } from "@/lib/supabase/server";

export async function getAdminMachineryCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("machinery_categories").select("*").order("sort_order");

  if (error) throw error;
  return data;
}

export async function getAdminMachineryList(options?: { categoryId?: string; search?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("machinery")
    .select("*, category:machinery_categories(id, name, slug)")
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

export async function getAdminMachineryById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("machinery")
    .select("*, category:machinery_categories(id, name, slug), specifications:machinery_specifications(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (data) {
    data.specifications = [...data.specifications].sort((a, b) => a.sort_order - b.sort_order);
  }
  return data;
}
