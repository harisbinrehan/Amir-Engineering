import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Matches PublicStubPage's shape (breadcrumb + heading + empty-state box).
 * `containerClassName` must match the real page's own `<Section>` width —
 * this is the route-level loading.tsx shown before the real page streams
 * in, so a mismatched width causes a visible snap on navigation.
 */
export function PublicStubLoading({ containerClassName = "max-w-3xl" }: { containerClassName?: string }) {
  return (
    <Section containerClassName={containerClassName}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-md" />
      <Skeleton className="mt-12 h-40 w-full rounded-lg" />
    </Section>
  );
}
