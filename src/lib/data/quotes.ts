import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
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

/**
 * The public confirmation page looks quotes up by reference number for an
 * anonymous visitor who has no RLS-visible row on `quotes` (guests never get
 * a SELECT policy — that would mean anyone could read anyone else's quote by
 * guessing a sequential reference). The service role bypasses RLS for this
 * one narrow, exact-match, limited-column read instead.
 */
export async function getQuoteByReference(reference: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("id, reference_number, status, full_name, email, created_at")
    .eq("reference_number", reference)
    .maybeSingle();

  if (error) throw error;
  return data;
}

const MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "short" });

/** Quote request volume per month — feeds the overview trend chart. */
export async function getMonthlyQuoteVolume(months = 6) {
  const supabase = await createClient();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - (months - 1));

  const { data, error } = await supabase
    .from("quotes")
    .select("created_at")
    .gte("created_at", start.toISOString());

  if (error) throw error;

  // Pre-build one bucket per month so empty months still render (not skipped).
  const buckets = new Map<string, { month: string; count: number }>();
  for (let i = 0; i < months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, { month: MONTH_LABEL.format(d), count: 0 });
  }

  for (const quote of data) {
    const date = new Date(quote.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.count += 1;
  }

  return Array.from(buckets.values());
}

const PIPELINE_BUCKET: Record<QuoteStatus, "Open" | "Won" | "Lost"> = {
  new: "Open",
  reviewing: "Open",
  contacted: "Open",
  quotation_sent: "Open",
  negotiation: "Open",
  approved: "Won",
  completed: "Won",
  rejected: "Lost",
};

/** All quote requests grouped into open/won/lost — feeds the overview pipeline chart. */
export async function getQuotePipelineBreakdown() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("quotes").select("status");

  if (error) throw error;

  const totals = { Open: 0, Won: 0, Lost: 0 };
  for (const quote of data) {
    totals[PIPELINE_BUCKET[quote.status]] += 1;
  }

  return totals;
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
