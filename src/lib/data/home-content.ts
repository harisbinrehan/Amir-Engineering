import { createPublicClient } from "@/lib/supabase/server";

export async function getTestimonials(limit = 6) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getFaqs(category?: string) {
  const supabase = createPublicClient();
  let query = supabase.from("faqs").select("*").eq("is_published", true).order("sort_order");

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
