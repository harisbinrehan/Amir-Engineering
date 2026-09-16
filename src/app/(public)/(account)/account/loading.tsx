import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <Section containerClassName="max-w-2xl">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="mt-2 h-4 w-40" />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-border rounded-lg border py-6">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="mt-8 h-4 w-24" />
    </Section>
  );
}
