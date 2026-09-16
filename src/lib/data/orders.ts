import { createServiceRoleClient } from "@/lib/supabase/server";

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
