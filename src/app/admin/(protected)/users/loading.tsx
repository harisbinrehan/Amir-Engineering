import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-9 w-64 rounded-md" />
      </div>

      <div className="border-border divide-border divide-y rounded-lg border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
