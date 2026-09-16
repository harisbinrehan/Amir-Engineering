"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import type { Enums } from "@/types/database.types";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateUserRole(userId: string, newRole: Enums<"app_role">): Promise<ActionResult> {
  const session = await requireRole(["super_admin"]);

  if (userId === session.user.id) {
    return { success: false, error: "You can't change your own role." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_user_role", { target_user_id: userId, new_role: newRole });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/users");
  return { success: true, data: undefined };
}

export async function setUserActive(userId: string, isActive: boolean): Promise<ActionResult> {
  const session = await requireRole(["super_admin"]);

  if (userId === session.user.id) {
    return { success: false, error: "You can't deactivate your own account." };
  }

  // profiles RLS only lets a user update their own row — deactivating
  // someone else's account is an intentionally staff-only action, so it goes
  // through the service role, gated by the requireRole check above.
  const admin = createServiceRoleClient();
  const { error } = await admin.from("profiles").update({ is_active: isActive }).eq("id", userId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/users");
  return { success: true, data: undefined };
}
