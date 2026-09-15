import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  await requireRole(["super_admin", "admin", "content_manager"]);

  return (
    <AdminStubPage
      title="Media Library"
      description="Upload and organize product, machinery, factory and project imagery, brochures and documents."
    />
  );
}
