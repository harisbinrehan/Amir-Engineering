import { ConstructionIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs, type BreadcrumbEntry } from "@/components/layout/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";

export function PublicStubPage({
  title,
  description,
  breadcrumbs,
}: {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbEntry[];
}) {
  return (
    <Section containerClassName="max-w-3xl">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="text-muted-foreground mt-3 text-lg">{description}</p>
      <EmptyState
        className="mt-12"
        icon={ConstructionIcon}
        title="This page is coming soon"
        description="We're still building this section out — check back shortly, or get in touch with our team."
      />
    </Section>
  );
}
