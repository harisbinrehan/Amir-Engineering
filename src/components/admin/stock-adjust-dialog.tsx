"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, PackagePlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { stockAdjustmentSchema, type StockAdjustmentInput } from "@/lib/validation/inventory-schema";
import { adjustStock } from "@/lib/actions/inventory";

export function StockAdjustDialog({
  variantId,
  sku,
  currentStock,
}: {
  variantId: string;
  sku: string;
  currentStock: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StockAdjustmentInput>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: { changeQty: 0, reason: "" },
  });

  const changeQty = watch("changeQty");

  const onSubmit = async (values: StockAdjustmentInput) => {
    const result = await adjustStock(variantId, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Stock updated");
    setOpen(false);
    reset({ changeQty: 0, reason: "" });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <PackagePlusIcon />
          Adjust Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adjust Stock — {sku}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.changeQty}>
              <FieldLabel htmlFor="changeQty">Change Amount *</FieldLabel>
              <FieldContent>
                <Input
                  id="changeQty"
                  type="number"
                  placeholder="e.g. 50 or -10"
                  {...register("changeQty", { valueAsNumber: true })}
                />
                <FieldDescription>
                  Current stock: {currentStock}. New stock will be{" "}
                  {currentStock + (Number.isFinite(changeQty) ? changeQty : 0)}.
                </FieldDescription>
                <FieldError errors={[errors.changeQty]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.reason}>
              <FieldLabel htmlFor="reason">Reason *</FieldLabel>
              <FieldContent>
                <Input id="reason" placeholder="e.g. New stock received, Damaged goods" {...register("reason")} />
                <FieldError errors={[errors.reason]} />
              </FieldContent>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Save Adjustment
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
