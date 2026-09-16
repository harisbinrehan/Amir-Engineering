"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { productSchema, slugify, type ProductInput } from "@/lib/validation/product-schema";
import { createProduct } from "@/lib/actions/products";
import type { getAdminProductCategories } from "@/lib/data/admin-products";

export function ProductFormDialog({
  categories,
}: {
  categories: Awaited<ReturnType<typeof getAdminProductCategories>>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      basePrice: 0,
      imageUrl: "",
      isActive: true,
      isFeatured: false,
    },
  });

  const categoryId = watch("categoryId");

  const onSubmit = async (values: ProductInput) => {
    const result = await createProduct(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Product created");
    setOpen(false);
    reset();
    setSlugTouched(false);
    router.push(`/admin/products/${result.data.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-food text-food-foreground hover:bg-food/90">
          <PlusIcon />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name *</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  {...register("name", {
                    onChange: (e) => {
                      if (!slugTouched) setValue("slug", slugify(e.target.value));
                    },
                  })}
                />
                <FieldError errors={[errors.name]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">Slug *</FieldLabel>
              <FieldContent>
                <Input
                  id="slug"
                  {...register("slug", { onChange: () => setSlugTouched(true) })}
                />
                <FieldError errors={[errors.slug]} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.categoryId}>
                <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                <FieldContent>
                  <Select value={categoryId} onValueChange={(v) => setValue("categoryId", v)}>
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
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.basePrice}>
                <FieldLabel htmlFor="basePrice">Base Price (PKR) *</FieldLabel>
                <FieldContent>
                  <Input
                    id="basePrice"
                    type="number"
                    min={0}
                    step="0.01"
                    {...register("basePrice", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.basePrice]} />
                </FieldContent>
              </Field>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Create &amp; Continue
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
