import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { EmptyState } from "@/components/common/empty-state";
import { getProductionLines } from "@/lib/data/production-lines";
import { realProductionLineImagesBySlug, productionLineFallbackImage } from "@/lib/content/real-machinery-media";

export const metadata: Metadata = {
  title: "Production Lines",
  description: "Complete, turnkey production lines for noodle, macaroni, pasta and vermicelli manufacturing.",
};

export default async function ProductionLinesPage() {
  const lines = await getProductionLines();

  return (
    <>
      <Section containerClassName="pb-8" className="pb-0">
        <Breadcrumbs items={[{ label: "Production Lines" }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Complete Production Lines
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
          Turnkey production systems engineered end to end — from raw material intake through mixing,
          extrusion, cutting, drying, cooling and packaging.
        </p>
      </Section>

      <Section className="pt-0">
        {lines.length === 0 ? (
          <EmptyState title="No production lines published yet" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lines.map((line) => (
              <Link
                key={line.id}
                href={`/production-lines/${line.slug}`}
                className="group border-border bg-card hover:border-industrial/60 flex flex-col overflow-hidden rounded-lg border transition-colors"
              >
                <div className="aspect-4/3 relative overflow-hidden">
                  <PlaceholderImage
                    src={realProductionLineImagesBySlug[line.slug] ?? productionLineFallbackImage}
                    seed={line.slug}
                    alt={line.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-heading text-base font-semibold">{line.name}</h3>
                  {line.short_description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">{line.short_description}</p>
                  )}
                  {line.capacity && <p className="text-muted-foreground mt-auto text-xs">{line.capacity}</p>}
                  <span className="text-foreground group-hover:text-industrial flex items-center gap-1 text-sm font-medium transition-colors">
                    View details
                    <ArrowRightIcon className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
