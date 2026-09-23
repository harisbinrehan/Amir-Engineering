import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductionLineDetailLoading() {
  return (
    <>
      <Section containerClassName="pb-0" className="pb-8">
        <Skeleton className="h-4 w-40" />
      </Section>

      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-4/3 w-full rounded-xl" />
          <div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <div className="mt-6 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Skeleton className="h-10 w-36 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <Skeleton className="bg-foreground/10 h-6 w-48" />
        <div className="mt-8 flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="bg-foreground/10 h-24 w-32 shrink-0 rounded-lg" />
          ))}
        </div>
      </Section>

      <Section>
        <Skeleton className="h-6 w-48" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </Section>
    </>
  );
}
