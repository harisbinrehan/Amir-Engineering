import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Users & Staff" };

export default async function AdminUsersPage() {
  await requireRole(["super_admin"]);

  return (
    <AdminStubPage
      title="Users & Staff"
      description="Manage staff accounts and roles: Super Admin, Admin, Finance, Sales and Content Manager."
    />
  );
}
