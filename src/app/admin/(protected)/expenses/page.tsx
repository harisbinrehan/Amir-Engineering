import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Expenses" };

export default async function AdminExpensesPage() {
  await requireRole(["super_admin", "admin", "finance"]);

  return (
    <AdminStubPage
      title="Expenses"
      description="Record company expenses by category, vendor and department, with receipt uploads."
    />
  );
}
