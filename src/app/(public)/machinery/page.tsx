import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MachineryCard } from "@/components/machinery/machinery-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { getMachineryCategories, getMachineryList } from "@/lib/data/machinery";

// Public catalog data doesn't change every request — cache the rendered page
// for a minute so repeat visits (and other visitors) get it instantly from
// the CDN instead of re-querying Supabase on every navigation.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Machinery",
  description:
    "Industrial machinery for noodle, macaroni, pasta and vermicelli production — mixing, extrusion, cutting, drying and packaging systems.",
};

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function MachineryGrid({ categoryFilter }: { categoryFilter?: string }) {
  const machinery = await getMachineryList(categoryFilter ? { categorySlug: categoryFilter } : undefined);

  if (machinery.length === 0) {
    return <EmptyState title="No machinery found" description="Try selecting a different category." />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {machinery.map((item) => (
        <MachineryCard key={item.id} machinery={item} />
      ))}
    </div>
  );
}

export default async function MachineryPage(props: PageProps<"/machinery">) {
  const searchParams = await props.searchParams;
  const categoryFilter = typeof searchParams?.category === "string" ? searchParams.category : undefined;

  const categories = await getMachineryCategories();

  return (
    <>
      <Section className="pb-0" containerClassName="pb-8">
        <Breadcrumbs items={[{ label: "Machinery" }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Industrial Machinery
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
          Individual machines and complete production systems engineered for noodle, macaroni, pasta and
          vermicelli manufacturing.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/machinery" scroll={false}>
            <Badge
              variant={!categoryFilter ? "default" : "secondary"}
              className={`px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground ${
                !categoryFilter ? "bg-industrial text-industrial-foreground hover:bg-industrial/90" : ""
              }`}
            >
              All Machinery
            </Badge>
          </Link>

          {categories.map((category) => {
            const isActive = categoryFilter === category.slug;
            const href = isActive ? "/machinery" : `/machinery?category=${category.slug}`;
            
            return (
              <Link key={category.id} href={href} scroll={false}>
                <Badge 
                  variant={isActive ? "default" : "secondary"} 
                  className={`px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground ${
                    isActive ? "bg-industrial text-industrial-foreground hover:bg-industrial/90" : ""
                  }`}
                >
                  {category.name}
                </Badge>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="pt-0">
        <Suspense key={categoryFilter ?? "all"} fallback={<GridSkeleton />}>
          <MachineryGrid categoryFilter={categoryFilter} />
        </Suspense>
      </Section>
    </>
  );
}
