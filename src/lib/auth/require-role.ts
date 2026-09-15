import { redirect } from "next/navigation";
import { getCurrentProfile, type StaffRole } from "@/lib/auth/get-profile";

/**
 * Server Component / Server Action guard for a role floor stricter than the
 * general staff gate in app/admin/layout.tsx (e.g. /admin/users → super_admin
 * only). Redirects to /admin/login when unauthenticated, or back to the
 * admin dashboard with an error flag when authenticated but under-privileged.
 *
 * This is a UX convenience, not the authorization boundary — Postgres RLS
 * enforces access regardless of what this function allows to render.
 */
export async function requireRole(allowed: StaffRole[]) {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/admin/login");
  }

  if (!allowed.includes(session.profile.role as StaffRole)) {
    redirect("/admin?error=unauthorized");
  }

  return session;
}
