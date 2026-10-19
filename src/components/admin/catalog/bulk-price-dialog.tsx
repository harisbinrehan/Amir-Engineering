"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  bulkAdjustPrice,
  previewBulkPriceAdjustment,
  type PriceAdjustMode,
  type PriceAdjustDirection,
} from "@/lib/actions/catalog-bulk";
import { formatCurrency } from "@/lib/utils/format";

type PreviewRow = Awaited<ReturnType<typeof previewBulkPriceAdjustment>>[number];

export function BulkPriceDialog({
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
  const [step, setStep] = useState<"configure" | "preview">("configure");
  const [mode, setMode] = useState<PriceAdjustMode>("percentage");
  const [direction, setDirection] = useState<PriceAdjustDirection>("increase");
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [isPending, setIsPending] = useState(false);

  const reset = () => {
    setStep("configure");
    setMode("percentage");
    setDirection("increase");
    setValue("");
    setPreview([]);
  };

  const buildPreview = async () => {
    const numeric = Number(value);
    if (!numeric || numeric <= 0 || isPending) return;
    setIsPending(true);
    try {
      const result = await previewBulkPriceAdjustment(selectedIds, mode, direction, numeric);
      setPreview(result);
      setStep("preview");
    } finally {
      setIsPending(false);
    }
  };

  const apply = async () => {
    const numeric = Number(value);
    if (!numeric || isPending) return;
    setIsPending(true);
    try {
      const result = await bulkAdjustPrice(selectedIds, mode, direction, numeric);
      if (result.results.length === 0) toast.error("Nothing was updated — the selection could not be processed");
      else if (result.failed > 0) toast.error(`${result.succeeded} updated, ${result.failed} failed`);
      else toast.success(`Price adjusted for ${result.succeeded} product${result.succeeded === 1 ? "" : "s"}`);
      setOpen(false);
      reset();
      onDone();
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => isPending && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {step === "configure" ? `Adjust Price for ${selectedIds.length} Products` : "Preview Changes"}
          </DialogTitle>
        </DialogHeader>

        {step === "configure" ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="bulk-price-mode">Type</FieldLabel>
                <FieldContent>
                  <Select value={mode} onValueChange={(v) => setMode(v as PriceAdjustMode)}>
                    <SelectTrigger className="w-full" id="bulk-price-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (PKR)</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="bulk-price-direction">Direction</FieldLabel>
                <FieldContent>
                  <Select value={direction} onValueChange={(v) => setDirection(v as PriceAdjustDirection)}>
                    <SelectTrigger className="w-full" id="bulk-price-direction">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="bulk-price-value">{mode === "percentage" ? "Percentage (%)" : "Amount (PKR)"}</FieldLabel>
              <FieldContent>
                <Input
                  id="bulk-price-value"
                  type="number"
                  min={0}
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === "percentage" ? "e.g. 10" : "e.g. 50"}
                />
              </FieldContent>
            </Field>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Before</TableHead>
                  <TableHead className="text-right">After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground text-right">{formatCurrency(p.basePriceBefore)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(p.basePriceAfter)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          {step === "configure" ? (
            <Button type="button" disabled={!value || Number(value) <= 0 || isPending} onClick={buildPreview}>
              {isPending && <Loader2Icon className="animate-spin" />}
              Preview Changes
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" disabled={isPending} onClick={() => setStep("configure")}>
                Back
              </Button>
              <Button type="button" disabled={isPending} onClick={apply}>
                {isPending && <Loader2Icon className="animate-spin" />}
                Apply to {preview.length} Products
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
