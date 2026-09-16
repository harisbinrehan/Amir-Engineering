import { Skeleton } from "@/components/ui/skeleton";

/** Matches AdminStubPage's shape (heading + empty-state box) instead of the dashboard-shaped generic admin fallback. */
export function AdminStubLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}
