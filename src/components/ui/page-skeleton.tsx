export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-muted h-8 w-56 rounded-md" />
      <div className="bg-muted mt-4 h-4 w-full max-w-xl rounded-md" />
      <div className="bg-muted mt-2 h-4 w-full max-w-md rounded-md" />

      <div className="mt-10 space-y-4">
        <div className="bg-muted h-32 w-full rounded-lg" />
        <div className="bg-muted h-32 w-full rounded-lg" />
        <div className="bg-muted h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}
