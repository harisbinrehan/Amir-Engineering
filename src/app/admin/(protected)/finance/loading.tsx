import { Skeleton } from "@/components/ui/skeleton";

export default function AdminFinanceLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-7 w-24" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      {Array.from({ length: 2 }).map((_, group) => (
        <div key={group}>
          <Skeleton className="h-4 w-24" />
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
