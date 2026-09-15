import type { Metadata } from "next";
import { PublicStubPage } from "@/components/common/public-stub-page";

export const metadata: Metadata = {
  title: "Projects",
  description: "Completed machinery and production line installations by Amir Engineering.",
};

export default function ProjectsPage() {
  return (
    <PublicStubPage
      title="Projects"
      description="Detailed case studies of completed installations — client, capacity, machinery supplied and results — are coming soon."
      breadcrumbs={[{ label: "Projects" }]}
    />
  );
}
