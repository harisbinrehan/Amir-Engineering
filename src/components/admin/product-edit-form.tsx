"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { productSchema, type ProductInput } from "@/lib/validation/product-schema";
import { updateProduct } from "@/lib/actions/products";
import type { getAdminProductCategories, getAdminProductById } from "@/lib/data/admin-products";

type Product = NonNullable<Awaited<ReturnType<typeof getAdminProductById>>>;

export function ProductEditForm({
  product,
  categories,
}: {
  product: Product;
  categories: Awaited<ReturnType<typeof getAdminProductCategories>>;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      categoryId: product.category_id ?? "",
      shortDescription: product.short_description ?? "",
      description: product.description ?? "",
      basePrice: Number(product.base_price),
      imageUrl: product.image_url ?? "",
      isActive: product.is_active,
      isFeatured: product.is_featured,
      seoTitle: product.seo_title ?? "",
      seoDescription: product.seo_description ?? "",
    },
  });

  const categoryId = watch("categoryId");
  const isActive = watch("isActive");
  const isFeatured = watch("isFeatured");
  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: ProductInput) => {
    const result = await updateProduct(product.id, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Product saved");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Name *</FieldLabel>
                <FieldContent>
                  <Input id="name" {...register("name")} />
                  <FieldError errors={[errors.name]} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.slug}>
                <FieldLabel htmlFor="slug">Slug *</FieldLabel>
                <FieldContent>
                  <Input id="slug" {...register("slug")} />
                  <FieldError errors={[errors.slug]} />
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
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

            <Field>
              <FieldLabel htmlFor="shortDescription">Short Description</FieldLabel>
              <FieldContent>
                <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <FieldContent>
                <Textarea id="description" rows={4} {...register("description")} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.imageUrl}>
              <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
              <FieldContent>
                <Input id="imageUrl" placeholder="/products/example.jpg or https://..." {...register("imageUrl")} />
                <FieldError errors={[errors.imageUrl]} />
              </FieldContent>
            </Field>

            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Preview" className="h-32 w-32 rounded-md border object-cover" />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.seoTitle}>
                <FieldLabel htmlFor="seoTitle">SEO Title</FieldLabel>
                <FieldContent>
                  <Input id="seoTitle" {...register("seoTitle")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="seoDescription">SEO Description</FieldLabel>
                <FieldContent>
                  <Input id="seoDescription" {...register("seoDescription")} />
                </FieldContent>
              </Field>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <Switch id="isActive" checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
                <FieldLabel htmlFor="isActive">Active (visible on site)</FieldLabel>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="isFeatured" checked={isFeatured} onCheckedChange={(v) => setValue("isFeatured", v)} />
                <FieldLabel htmlFor="isFeatured">Featured on homepage</FieldLabel>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Save Changes
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
