import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  await requireRole(["super_admin", "admin"]);

  return (
    <AdminStubPage
      title="Products"
      description="Create, edit and publish food products, variants, pricing and inventory."
    />
  );
}
