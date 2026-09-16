import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the small centered auth-form pages (login, register, set-password, admin login). */
export function AuthCardLoading() {
  return (
    <Section containerClassName="max-w-sm">
      <Skeleton className="mx-auto h-7 w-32" />
      <Skeleton className="mx-auto mt-2 h-4 w-48" />

      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </Section>
  );
}
