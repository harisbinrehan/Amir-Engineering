import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches PublicStubPage's shape (breadcrumb + heading + empty-state box). */
export function PublicStubLoading() {
  return (
    <Section containerClassName="max-w-3xl">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-md" />
      <Skeleton className="mt-12 h-40 w-full rounded-lg" />
    </Section>
  );
}
