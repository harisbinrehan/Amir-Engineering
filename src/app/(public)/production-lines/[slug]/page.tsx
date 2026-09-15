import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { ProcessFlow } from "@/components/production-lines/process-flow";
import { RequestQuoteButton } from "@/components/machinery/request-quote-button";
import { BrochureDownloadButton } from "@/components/machinery/brochure-download-button";
import { getProductionLineBySlug } from "@/lib/data/production-lines";

export async function generateMetadata(props: PageProps<"/production-lines/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const line = await getProductionLineBySlug(slug);
  if (!line) return {};

  return { title: line.name, description: line.short_description ?? undefined };
}

export default async function ProductionLineDetailPage(props: PageProps<"/production-lines/[slug]">) {
  const { slug } = await props.params;
  const line = await getProductionLineBySlug(slug);
  if (!line) notFound();

  const keyFacts = [
    { label: "Production Capacity", value: line.capacity },
    { label: "Required Space", value: line.required_space },
    { label: "Power Requirement", value: line.power_requirement },
  ].filter((fact) => fact.value);

  return (
    <>
      <Section containerClassName="pb-0" className="pb-8">
        <Breadcrumbs items={[{ label: "Production Lines", href: "/production-lines" }, { label: line.name }]} />
      </Section>

      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-4/3 relative overflow-hidden rounded-xl">
            <PlaceholderImage seed={line.slug} alt={line.name} fill priority className="object-cover" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{line.name}</h1>
            {line.short_description && (
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{line.short_description}</p>
            )}

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {keyFacts.map((fact) => (
                <div key={fact.label} className="border-border rounded-lg border p-3">
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <RequestQuoteButton productionLineId={line.id} />
              <BrochureDownloadButton brochureUrl={line.brochure_url} />
            </div>
          </div>
        </div>

        {line.description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold tracking-tight">Overview</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">{line.description}</p>
          </div>
        )}
      </Section>

      {line.stages.length > 0 && (
        <Section variant="dark">
          <h2 className="font-heading text-2xl font-bold tracking-tight">Production Process</h2>
          <div className="mt-8">
            <ProcessFlow stages={line.stages} />
          </div>
        </Section>
      )}

      {line.machines.length > 0 && (
        <Section>
          <h2 className="font-heading text-2xl font-bold tracking-tight">Machines Included</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {line.machines.map((entry) => (
              <Link
                key={entry.id}
                href={entry.machinery ? `/machinery/${entry.machinery.slug}` : "#"}
                className="border-border bg-card hover:border-industrial/60 rounded-lg border p-4 transition-colors"
              >
                {entry.stage && (
                  <span className="text-industrial text-xs font-semibold tracking-wide uppercase">
                    {entry.stage.name}
                  </span>
                )}
                <p className="font-heading mt-1 text-sm font-semibold">{entry.machinery?.name}</p>
                {entry.machinery?.short_description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {entry.machinery.short_description}
                  </p>
                )}
                <p className="text-muted-foreground mt-2 text-xs">Quantity: {entry.quantity}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
