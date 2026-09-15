import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type Profile = Tables<"profiles">;

/**
 * Loads the current user + profile once per request (React `cache`
 * deduplicates repeated calls across Server Components in the same render).
 */
export const getCurrentProfile = cache(async (): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;
  profile: Profile;
} | null> => {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { user, profile };
});

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export const STAFF_ROLES = ["super_admin", "admin", "finance", "sales", "content_manager"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role: Profile["role"]): role is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(role);
}
