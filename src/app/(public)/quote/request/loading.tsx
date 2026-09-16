import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuoteRequestLoading() {
  return (
    <Section containerClassName="max-w-2xl">
      <Breadcrumbs items={[{ label: "Request a Quote" }]} />
      <Skeleton className="mt-4 h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-full" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>

      <Skeleton className="mt-6 h-10 w-40 rounded-md" />
    </Section>
  );
}
