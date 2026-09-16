import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountOrdersLoading() {
  return (
    <Section containerClassName="max-w-3xl">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-7 w-48" />

      <div className="divide-border border-border mt-8 divide-y rounded-lg border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
