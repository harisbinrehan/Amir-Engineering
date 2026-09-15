import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Machinery" };

export default async function AdminMachineryPage() {
  await requireRole(["super_admin", "admin"]);

  return (
    <AdminStubPage
      title="Machinery"
      description="Manage machinery listings, categories, specifications, images and brochures."
    />
  );
}
