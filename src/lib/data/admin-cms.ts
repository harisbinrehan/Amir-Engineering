import { createClient } from "@/lib/supabase/server";

export async function getAdminTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");

  if (error) throw error;
  return data;
}

export async function getAdminFaqs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");

  if (error) throw error;
  return data;
}
