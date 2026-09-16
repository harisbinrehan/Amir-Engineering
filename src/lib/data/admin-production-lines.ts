import { createClient } from "@/lib/supabase/server";

export async function getAdminProductionLines(options?: { search?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("production_lines")
    .select("*, stages:production_line_stages(id)")
    .is("deleted_at", null)
    .order("name");

  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAdminProductionLineById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("production_lines")
    .select(
      `*,
      stages:production_line_stages(*),
      machines:production_line_machines(*, machinery:machinery(id, name, slug), stage:production_line_stages(id, name))`,
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (data) {
    data.stages = [...data.stages].sort((a, b) => a.sort_order - b.sort_order);
    data.machines = [...data.machines].sort((a, b) => a.sort_order - b.sort_order);
  }
  return data;
}

export async function getAdminMachineryOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("machinery")
    .select("id, name")
    .is("deleted_at", null)
    .order("name");

  if (error) throw error;
  return data;
}
