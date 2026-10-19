"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckIcon, TagIcon, DollarSignIcon, PackageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bulkUpdateStatus } from "@/lib/actions/catalog-bulk";
import { BulkCategoryDialog } from "./bulk-category-dialog";
import { BulkPriceDialog } from "./bulk-price-dialog";
import { BulkStockDialog } from "./bulk-stock-dialog";
import type { getAdminProductCategories } from "@/lib/data/admin-products";

type SelectedRow = { id: string; name: string };

export function CatalogBulkToolbar({
  selectedIds,
  selectedRows,
  categories,
  onDone,
}: {
  selectedIds: string[];
  selectedRows: SelectedRow[];
  categories: Awaited<ReturnType<typeof getAdminProductCategories>>;
  onDone: () => void;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const runStatusUpdate = async (isActive: boolean) => {
    if (isPending) return;
    setIsPending(true);
    try {
      const result = await bulkUpdateStatus(selectedIds, isActive);
      if (result.results.length === 0) {
        toast.error("Nothing was updated — the selection could not be processed");
      } else if (result.failed > 0) {
        toast.error(`${result.succeeded} updated, ${result.failed} failed`);
      } else {
        toast.success(`${result.succeeded} product${result.succeeded === 1 ? "" : "s"} ${isActive ? "activated" : "deactivated"}`);
      }
      onDone();
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-card flex flex-wrap items-center gap-2 rounded-lg border p-3">
      <span className="text-sm font-medium">{selectedIds.length} selected</span>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => runStatusUpdate(true)}>
          <CheckIcon className="size-3.5" />
          Activate
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => runStatusUpdate(false)}>
          <XIcon className="size-3.5" />
          Deactivate
        </Button>
        <BulkCategoryDialog
          selectedIds={selectedIds}
          categories={categories}
          onDone={onDone}
          trigger={
            <Button type="button" variant="outline" size="sm">
              <TagIcon className="size-3.5" />
              Set Category
            </Button>
          }
        />
        <BulkPriceDialog
          selectedIds={selectedIds}
          selectedRows={selectedRows}
          onDone={onDone}
          trigger={
            <Button type="button" variant="outline" size="sm">
              <DollarSignIcon className="size-3.5" />
              Adjust Price
            </Button>
          }
        />
        <BulkStockDialog
          selectedIds={selectedIds}
          selectedRows={selectedRows}
          onDone={onDone}
          trigger={
            <Button type="button" variant="outline" size="sm">
              <PackageIcon className="size-3.5" />
              Set Stock
            </Button>
          }
        />
      </div>
    </div>
  );
}
