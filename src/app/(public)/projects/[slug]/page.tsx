import type { Metadata } from "next";
import { PublicStubPage } from "@/components/common/public-stub-page";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectDetailPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;

  return (
    <PublicStubPage
      title="Project Case Study"
      description={`The case study for "${slug}" is coming soon.`}
      breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: slug }]}
    />
  );
}
