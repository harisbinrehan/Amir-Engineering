import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  await requireRole(["super_admin", "admin", "sales"]);

  return (
    <AdminStubPage
      title="Orders"
      description="View and manage food product orders, payment status and fulfillment."
    />
  );
}
