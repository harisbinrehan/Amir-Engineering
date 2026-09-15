import type { Metadata } from "next";
import { AdminStubPage } from "@/components/admin/admin-stub-page";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "CMS" };

export default async function AdminCmsPage() {
  await requireRole(["super_admin", "admin", "content_manager"]);

  return (
    <AdminStubPage
      title="Content Management"
      description="Manage homepage sections, banners, projects, blog posts, testimonials and FAQs."
    />
  );
}
