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

/**
 * Reads the session from the cookie locally — no network round trip to the
 * Supabase Auth server. Safe here because every caller of this function sits
 * behind proxy.ts's middleware (/account/*, /admin/*), which already did a
 * fresh, server-verified `getUser()` check moments earlier in the same
 * request; this is just re-deriving the same identity for rendering. The
 * real authorization boundary is Postgres RLS regardless (see
 * requireRole's own comment), so this never weakens actual access control —
 * it just stops paying for the same network check twice per navigation.
 */
async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

export const STAFF_ROLES = ["super_admin", "admin", "finance", "sales", "content_manager"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role: Profile["role"]): role is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(role);
}
