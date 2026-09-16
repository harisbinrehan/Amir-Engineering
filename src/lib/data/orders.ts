import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

/**
 * The public confirmation page looks orders up by order number for an
 * anonymous visitor who has no RLS-visible row on `orders` (guests never get
 * a SELECT policy — that would mean anyone could read anyone else's order by
 * guessing a sequential order number). The service role bypasses RLS for
 * this one narrow, exact-match read instead.
 */
export async function getOrderByNumber(orderNumber: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** A logged-in customer's own order history — RLS already scopes this to their own rows. */
export async function getOrdersByProfileId(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Public "track my order" lookup for guests who haven't set a password yet.
 * Requires both the order number and the contact email to match — the
 * service role bypasses RLS, so this extra check is what stops anyone from
 * reading an arbitrary order just by guessing its (sequential) number.
 */
export async function getOrderByNumberAndEmail(orderNumber: string, email: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("order_number", orderNumber)
    .ilike("contact_email", email.trim())
    .maybeSingle();

  if (error) throw error;
  return data;
}
