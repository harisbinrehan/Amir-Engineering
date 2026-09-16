export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-muted h-8 w-48 rounded-md" />
      <div className="bg-muted mt-4 h-4 w-full max-w-xl rounded-md" />
      <div className="bg-muted mt-2 h-4 w-full max-w-md rounded-md" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-border overflow-hidden rounded-lg border">
            <div className="bg-muted aspect-4/3" />
            <div className="space-y-2 p-5">
              <div className="bg-muted h-4 w-3/4 rounded-md" />
              <div className="bg-muted h-3 w-full rounded-md" />
              <div className="bg-muted h-3 w-2/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
