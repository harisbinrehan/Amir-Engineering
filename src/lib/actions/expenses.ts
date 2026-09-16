"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { expenseSchema } from "@/lib/validation/expense-schema";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const FINANCE_ROLES = ["super_admin", "admin", "finance"] as const;

export async function createExpense(input: unknown): Promise<ActionResult> {
  const session = await requireRole([...FINANCE_ROLES]);

  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("expenses").insert({
    description: values.description,
    amount: values.amount,
    expense_date: values.expenseDate,
    category_id: values.categoryId,
    vendor_id: values.vendorId || null,
    department: values.department,
    payment_method: values.paymentMethod || null,
    project: values.project || null,
    notes: values.notes || null,
    created_by: session.profile.id,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/expenses");
  return { success: true, data: undefined };
}

export async function updateExpense(expenseId: string, input: unknown): Promise<ActionResult> {
  await requireRole([...FINANCE_ROLES]);

  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("expenses")
    .update({
      description: values.description,
      amount: values.amount,
      expense_date: values.expenseDate,
      category_id: values.categoryId,
      vendor_id: values.vendorId || null,
      department: values.department,
      payment_method: values.paymentMethod || null,
      project: values.project || null,
      notes: values.notes || null,
    })
    .eq("id", expenseId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/expenses");
  return { success: true, data: undefined };
}

export async function deleteExpense(expenseId: string): Promise<ActionResult> {
  await requireRole([...FINANCE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/expenses");
  return { success: true, data: undefined };
}
