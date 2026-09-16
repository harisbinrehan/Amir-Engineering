import { createPublicClient } from "@/lib/supabase/server";

export async function getProductionLines() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("production_lines")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data;
}

export async function getProductionLineBySlug(slug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("production_lines")
    .select(
      `*,
      stages:production_line_stages(*),
      machines:production_line_machines(
        *,
        machinery:machinery(id, name, slug, short_description),
        stage:production_line_stages(id, name)
      )`,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    data.stages = [...data.stages].sort((a, b) => a.sort_order - b.sort_order);
  }

  return data;
}
