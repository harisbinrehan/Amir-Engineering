"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { bulkSetStock } from "@/lib/actions/catalog-bulk";

export function BulkStockDialog({
  selectedIds,
  onDone,
  trigger,
}: {
  selectedIds: string[];
  selectedRows: { id: string; name: string }[];
  onDone: () => void;
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false);

  const apply = async () => {
    const numeric = Number(value);
    if (Number.isNaN(numeric) || numeric < 0 || isPending) return;
    setIsPending(true);
    try {
      const result = await bulkSetStock(selectedIds, numeric);
      if (result.results.length === 0) {
        toast.error("Nothing was updated — the selection could not be processed");
      } else if (result.failed > 0) {
        toast.error(`${result.succeeded} updated, ${result.failed} skipped (multi-variant products need individual edits)`);
      } else {
        toast.success(`Stock set for ${result.succeeded} product${result.succeeded === 1 ? "" : "s"}`);
      }
      setOpen(false);
      setValue("");
      onDone();
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set Stock for {selectedIds.length} Products</AlertDialogTitle>
          <AlertDialogDescription>
            Only applies to single-variant products — multi-variant products are skipped and reported, since there&apos;s
            no single stock figure to set for them in bulk.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          type="number"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="New stock quantity"
        />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={!value || isPending} onClick={(e) => { e.preventDefault(); apply(); }}>
            {isPending && <Loader2Icon className="animate-spin" />}
            Apply
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
