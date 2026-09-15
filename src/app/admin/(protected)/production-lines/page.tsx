import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Production Lines" };

export default async function AdminProductionLinesPage() {
  await requireRole(["super_admin", "admin"]);

  return (
    <AdminStubPage
      title="Production Lines"
      description="Build complete production lines: stages, included machinery, capacity and brochures."
    />
  );
}
