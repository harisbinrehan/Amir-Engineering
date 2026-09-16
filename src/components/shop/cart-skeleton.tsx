export function CartSkeleton() {
  return (
    <div className="mt-8 grid animate-pulse gap-8 lg:grid-cols-3">
      <div className="divide-border border-border divide-y rounded-lg border lg:col-span-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="bg-muted size-16 shrink-0 rounded-md sm:size-20" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 w-1/2 rounded" />
              <div className="bg-muted h-3 w-1/4 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-border bg-card h-40 rounded-lg border" />
    </div>
  );
}
