import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Finance" };

export default async function AdminFinancePage() {
  await requireRole(["super_admin", "admin", "finance"]);

  return (
    <AdminStubPage
      title="Financial Dashboard"
      description="Revenue, expenses, profit trends and exportable reports — daily, weekly, monthly and yearly."
    />
  );
}
