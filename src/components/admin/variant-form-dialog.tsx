"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { variantSchema, type VariantInput } from "@/lib/validation/product-schema";
import { createVariant, updateVariant } from "@/lib/actions/products";
import type { getAdminProductById } from "@/lib/data/admin-products";

type Variant = NonNullable<Awaited<ReturnType<typeof getAdminProductById>>>["variants"][number];

export function VariantFormDialog({
  productId,
  variant,
  trigger,
}: {
  productId: string;
  variant?: Variant;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!variant;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VariantInput>({
    resolver: zodResolver(variantSchema),
    defaultValues: variant
      ? {
          sku: variant.sku,
          label: variant.label ?? "",
          price: variant.price !== null ? Number(variant.price) : null,
          weightGrams: variant.weight_grams,
          stockQuantity: variant.stock_quantity,
          lowStockThreshold: variant.low_stock_threshold,
          isActive: variant.is_active,
        }
      : { stockQuantity: 0, lowStockThreshold: 10, isActive: true },
  });

  const isActive = watch("isActive");

  const onSubmit = async (values: VariantInput) => {
    const result = isEditing
      ? await updateVariant(variant.id, productId, values)
      : await createVariant(productId, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Variant updated" : "Variant added");
    setOpen(false);
    if (!isEditing) reset({ stockQuantity: 0, lowStockThreshold: 10, isActive: true });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <PlusIcon />
            Add Variant
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Variant" : "Add Variant"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.sku}>
                <FieldLabel htmlFor="sku">SKU *</FieldLabel>
                <FieldContent>
                  <Input id="sku" {...register("sku")} />
                  <FieldError errors={[errors.sku]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="label">Label</FieldLabel>
                <FieldContent>
                  <Input id="label" placeholder="e.g. 500g Pack" {...register("label")} />
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Price (PKR)</FieldLabel>
                <FieldContent>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    {...register("price", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                  />
                  <FieldError errors={[errors.price]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="weightGrams">Weight (grams)</FieldLabel>
                <FieldContent>
                  <Input
                    id="weightGrams"
                    type="number"
                    min={0}
                    {...register("weightGrams", {
                      setValueAs: (v) => (v === "" ? null : Number(v)),
                    })}
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.stockQuantity}>
                <FieldLabel htmlFor="stockQuantity">Stock Quantity *</FieldLabel>
                <FieldContent>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min={0}
                    {...register("stockQuantity", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.stockQuantity]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!errors.lowStockThreshold}>
                <FieldLabel htmlFor="lowStockThreshold">Low Stock Alert *</FieldLabel>
                <FieldContent>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min={0}
                    {...register("lowStockThreshold", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.lowStockThreshold]} />
                </FieldContent>
              </Field>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="variantIsActive" checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
              <FieldLabel htmlFor="variantIsActive">Active</FieldLabel>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Variant"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
