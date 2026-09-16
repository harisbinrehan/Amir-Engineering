import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Shared shape for machinery/product/production-line detail pages: gallery + info, then a details section below. */
export function DetailPageSkeleton() {
  return (
    <>
      <Section containerClassName="pb-0" className="pb-8">
        <Skeleton className="h-4 w-40" />
      </Section>

      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Skeleton className="aspect-4/3 w-full rounded-xl" />
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="mt-3 h-8 w-3/4" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />

            <div className="mt-6 grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Skeleton className="h-10 w-36 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-3xl space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Section>
    </>
  );
}
