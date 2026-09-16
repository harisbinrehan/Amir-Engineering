import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Shared shape for the quote and order confirmation pages: icon, message, reference box, optional item list. */
export function ConfirmationPageSkeleton({ withItems = false }: { withItems?: boolean }) {
  return (
    <Section containerClassName="max-w-xl text-center">
      <Skeleton className="mx-auto size-14 rounded-full" />
      <Skeleton className="mx-auto mt-6 h-8 w-64" />
      <Skeleton className="mx-auto mt-4 h-4 w-full" />
      <Skeleton className="mx-auto mt-2 h-4 w-2/3" />

      <Skeleton className="mx-auto mt-8 h-20 w-full rounded-lg" />

      {withItems && (
        <div className="border-border mt-8 space-y-0 rounded-lg border text-left">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center gap-3">
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
    </Section>
  );
}
