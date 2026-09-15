import { redirect } from "next/navigation";
import { getCurrentProfile, isStaffRole } from "@/lib/auth/get-profile";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentProfile();

  if (!session || !isStaffRole(session.profile.role)) {
    redirect("/admin/login");
  }

  const role = session.profile.role;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar role={role} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar fullName={session.profile.full_name ?? session.user.email ?? "Admin"} role={role} />
        <main className="bg-secondary/30 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
