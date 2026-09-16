"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { stockAdjustmentSchema } from "@/lib/validation/inventory-schema";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function adjustStock(variantId: string, input: unknown): Promise<ActionResult> {
  const session = await requireRole(["super_admin", "admin"]);

  const parsed = stockAdjustmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.rpc("adjust_variant_stock", {
    p_variant_id: variantId,
    p_change_qty: values.changeQty,
    p_reason: values.reason,
    p_created_by: session.profile.id,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/inventory");
  return { success: true, data: undefined };
}
