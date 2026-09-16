"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { vendorSchema } from "@/lib/validation/vendor-schema";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const FINANCE_ROLES = ["super_admin", "admin", "finance"] as const;

export async function createVendor(input: unknown): Promise<ActionResult> {
  await requireRole([...FINANCE_ROLES]);

  const parsed = vendorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("vendors").insert({
    name: values.name,
    contact_person: values.contactPerson || null,
    phone: values.phone || null,
    email: values.email || null,
    notes: values.notes || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/finance");
  return { success: true, data: undefined };
}

export async function updateVendor(vendorId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...FINANCE_ROLES]);

  const parsed = vendorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("vendors")
    .update({
      name: values.name,
      contact_person: values.contactPerson || null,
      phone: values.phone || null,
      email: values.email || null,
      notes: values.notes || null,
    })
    .eq("id", vendorId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/finance");
  return { success: true, data: undefined };
}

export async function deleteVendor(vendorId: string): Promise<ActionResult> {
  await requireRole([...FINANCE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("vendors").delete().eq("id", vendorId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/finance");
  return { success: true, data: undefined };
}
