import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MachineryCard } from "@/components/machinery/machinery-card";
import { EmptyState } from "@/components/common/empty-state";
import { getMachineryCategoryBySlug, getMachineryList } from "@/lib/data/machinery";

export async function generateMetadata(props: PageProps<"/machinery/category/[categorySlug]">): Promise<Metadata> {
  const { categorySlug } = await props.params;
  const category = await getMachineryCategoryBySlug(categorySlug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function MachineryCategoryPage(props: PageProps<"/machinery/category/[categorySlug]">) {
  const { categorySlug } = await props.params;
  const category = await getMachineryCategoryBySlug(categorySlug);
  if (!category) notFound();

  const machinery = await getMachineryList({ categorySlug });

  return (
    <>
      <Section className="pb-0" containerClassName="pb-8">
        <Breadcrumbs items={[{ label: "Machinery", href: "/machinery" }, { label: category.name }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg">{category.description}</p>
        )}
      </Section>

      <Section className="pt-0">
        {machinery.length === 0 ? (
          <EmptyState
            title="No machinery in this category yet"
            description="Contact our sales team for the latest availability."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {machinery.map((item) => (
              <MachineryCard key={item.id} machinery={item} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
