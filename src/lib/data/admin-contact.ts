import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

export async function getContactInquiries(options?: { status?: Enums<"contact_inquiry_status">; search?: string }) {
  const supabase = await createClient();
  let query = supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.search) {
    query = query.or(`full_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getContactInquiryCounts() {
  const supabase = await createClient();
  const { count: newCount } = await supabase
    .from("contact_inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");
  const { count: totalCount } = await supabase
    .from("contact_inquiries")
    .select("*", { count: "exact", head: true });

  return { newCount: newCount ?? 0, totalCount: totalCount ?? 0 };
}
