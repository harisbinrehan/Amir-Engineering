"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CatalogPagination({ page, pageCount, total }: { page: number; pageCount: number; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        Page {page} of {pageCount} &middot; {total} total
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
          <ChevronLeftIcon className="size-3.5" />
          Previous
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={page >= pageCount} onClick={() => goTo(page + 1)}>
          Next
          <ChevronRightIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
