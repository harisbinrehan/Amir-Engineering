import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Inventory" };

export default async function AdminInventoryPage() {
  await requireRole(["super_admin", "admin"]);

  return (
    <AdminStubPage
      title="Inventory"
      description="Track stock levels, low-stock alerts and inventory adjustments across product variants."
    />
  );
}
