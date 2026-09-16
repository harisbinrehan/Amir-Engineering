import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
