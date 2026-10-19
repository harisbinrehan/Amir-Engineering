"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { bulkUpdateCategory } from "@/lib/actions/catalog-bulk";
import type { getAdminProductCategories } from "@/lib/data/admin-products";

export function BulkCategoryDialog({
  selectedIds,
  categories,
  onDone,
  trigger,
}: {
  selectedIds: string[];
  categories: Awaited<ReturnType<typeof getAdminProductCategories>>;
  onDone: () => void;
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [isPending, setIsPending] = useState(false);

  const apply = async () => {
    if (!categoryId || isPending) return;
    setIsPending(true);
    try {
      const result = await bulkUpdateCategory(selectedIds, categoryId);
      if (result.results.length === 0) toast.error("Nothing was updated — the selection could not be processed");
      else if (result.failed > 0) toast.error(`${result.succeeded} updated, ${result.failed} failed`);
      else toast.success(`Category set for ${result.succeeded} product${result.succeeded === 1 ? "" : "s"}`);
      setOpen(false);
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
          <AlertDialogTitle>Set Category for {selectedIds.length} Products</AlertDialogTitle>
          <AlertDialogDescription>This will overwrite the current category on every selected product.</AlertDialogDescription>
        </AlertDialogHeader>

        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={!categoryId || isPending} onClick={(e) => { e.preventDefault(); apply(); }}>
            {isPending && <Loader2Icon className="animate-spin" />}
            Apply
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
