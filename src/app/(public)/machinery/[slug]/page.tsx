import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Gallery } from "@/components/machinery/gallery";
import { SpecTable } from "@/components/machinery/spec-table";
import { RelatedMachinery } from "@/components/machinery/related-machinery";
import { BrochureDownloadButton } from "@/components/machinery/brochure-download-button";
import { RequestQuoteButton } from "@/components/machinery/request-quote-button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/content/site-config";
import { getMachineryBySlug, getRelatedMachinery, getMachineryList } from "@/lib/data/machinery";
import { realMachineryImagesBySlug } from "@/lib/content/real-machinery-media";

export const revalidate = 60;

export async function generateStaticParams() {
  const machinery = await getMachineryList();
  return machinery.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: PageProps<"/machinery/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const machinery = await getMachineryBySlug(slug);
  if (!machinery) return {};

  return {
    title: machinery.seo_title ?? machinery.name,
    description: machinery.seo_description ?? machinery.short_description ?? undefined,
  };
}

const keyFacts = (machinery: NonNullable<Awaited<ReturnType<typeof getMachineryBySlug>>>) =>
  [
    { label: "Production Capacity", value: machinery.capacity },
    { label: "Power Requirement", value: machinery.power_requirement },
    { label: "Dimensions", value: machinery.dimensions },
    { label: "Weight", value: machinery.weight },
    { label: "Voltage", value: machinery.voltage },
    { label: "Material", value: machinery.material },
  ].filter((fact) => fact.value);

export default async function MachineryDetailPage(props: PageProps<"/machinery/[slug]">) {
  const { slug } = await props.params;
  const machinery = await getMachineryBySlug(slug);
  if (!machinery) notFound();

  const related = await getRelatedMachinery(machinery.category_id, machinery.id);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: machinery.name,
    description: machinery.short_description ?? machinery.description ?? undefined,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: machinery.category?.name,
    url: `${siteConfig.url}/machinery/${machinery.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Section containerClassName="pb-0" className="pb-8">
        <Breadcrumbs
          items={[
            { label: "Machinery", href: "/machinery" },
            ...(machinery.category
              ? [{ label: machinery.category.name, href: `/machinery/category/${machinery.category.slug}` }]
              : []),
            { label: machinery.name },
          ]}
        />
      </Section>

      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* machinery_images will resolve to real Storage URLs once more photography is uploaded via the admin media library; until then a small hand-picked set covers matching machine types. */}
          <Gallery seed={machinery.slug} name={machinery.name} images={realMachineryImagesBySlug[machinery.slug] ?? []} />

          <div>
            {machinery.category && <Badge variant="secondary">{machinery.category.name}</Badge>}
            <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {machinery.name}
            </h1>
            {machinery.short_description && (
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {machinery.short_description}
              </p>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4">
              {keyFacts(machinery).map((fact) => (
                <div key={fact.label} className="border-border rounded-lg border p-3">
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <RequestQuoteButton machineryId={machinery.id} />
              <BrochureDownloadButton brochureUrl={machinery.brochure_url} />
            </div>
          </div>
        </div>

        {machinery.description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold tracking-tight">Overview</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">{machinery.description}</p>
          </div>
        )}

        {machinery.specifications.length > 0 && (
          <div className="mt-16 max-w-3xl">
            <h2 className="font-heading mb-6 text-2xl font-bold tracking-tight">Technical Specifications</h2>
            <SpecTable specifications={machinery.specifications} />
          </div>
        )}
      </Section>

      <RelatedMachinery items={related} />
    </>
  );
}
