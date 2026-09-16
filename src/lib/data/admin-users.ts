import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

export async function getAdminUsers(options?: { role?: Enums<"app_role">; search?: string }) {
  const supabase = await createClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });

  if (options?.role) {
    query = query.eq("role", options.role);
  }

  const { data: profiles, error } = await query;
  if (error) throw error;

  const admin = createServiceRoleClient();
  const { data: usersPage } = await admin.auth.admin.listUsers({ perPage: 200 });
  const emailById = new Map(usersPage.users.map((u) => [u.id, u.email ?? ""]));

  let rows = profiles.map((p) => ({ ...p, email: emailById.get(p.id) ?? "" }));

  if (options?.search) {
    const term = options.search.toLowerCase();
    rows = rows.filter(
      (r) => r.email.toLowerCase().includes(term) || (r.full_name ?? "").toLowerCase().includes(term),
    );
  }

  return rows;
}
