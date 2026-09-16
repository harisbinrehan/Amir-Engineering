import { createClient } from "@/lib/supabase/server";

export async function getAdminMedia({ search }: { search?: string } = {}) {
  const supabase = await createClient();
  let query = supabase.from("media").select("*").order("created_at", { ascending: false });

  if (search) query = query.ilike("file_name", `%${search}%`);

  const { data, error } = await query;

  if (error) throw error;

  return data.map((row) => ({
    ...row,
    url: supabase.storage.from(row.bucket).getPublicUrl(row.storage_path).data.publicUrl,
  }));
}
