import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

export type QuoteStatus = Enums<"quote_status">;

export async function getQuotes(options?: { status?: QuoteStatus | "all"; search?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("quotes")
    .select("*, assigned:profiles!quotes_assigned_to_fkey(id, full_name)")
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.search) {
    const term = options.search.trim();
    query = query.or(
      `reference_number.ilike.%${term}%,full_name.ilike.%${term}%,company_name.ilike.%${term}%,email.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getQuoteById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select(
      `*,
      assigned:profiles!quotes_assigned_to_fkey(id, full_name),
      items:quote_items(
        *,
        machinery:machinery(id, name, slug),
        production_line:production_lines(id, name, slug)
      ),
      notes:quote_notes(*, author:profiles!quote_notes_author_id_fkey(id, full_name)),
      status_history:quote_status_history(*, changed_by_profile:profiles!quote_status_history_changed_by_fkey(id, full_name))`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    data.notes = [...data.notes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    data.status_history = [...data.status_history].sort(
      (a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime(),
    );
  }

  return data;
}

export async function getQuoteByReference(reference: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("id, reference_number, status, full_name, email, created_at")
    .eq("reference_number", reference)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getStaffProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("role", ["super_admin", "admin", "sales"])
    .order("full_name");

  if (error) throw error;
  return data;
}
