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
import { machinerySchema, type MachineryInput } from "@/lib/validation/machinery-schema";
import { updateMachinery } from "@/lib/actions/machinery";
import type { getAdminMachineryCategories, getAdminMachineryById } from "@/lib/data/admin-machinery";

type Machinery = NonNullable<Awaited<ReturnType<typeof getAdminMachineryById>>>;

export function MachineryEditForm({
  machinery,
  categories,
}: {
  machinery: Machinery;
  categories: Awaited<ReturnType<typeof getAdminMachineryCategories>>;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MachineryInput>({
    resolver: zodResolver(machinerySchema),
    defaultValues: {
      name: machinery.name,
      slug: machinery.slug,
      categoryId: machinery.category_id ?? "",
      shortDescription: machinery.short_description ?? "",
      description: machinery.description ?? "",
      capacity: machinery.capacity ?? "",
      powerRequirement: machinery.power_requirement ?? "",
      dimensions: machinery.dimensions ?? "",
      weight: machinery.weight ?? "",
      voltage: machinery.voltage ?? "",
      material: machinery.material ?? "",
      imageUrl: machinery.image_url ?? "",
      brochureUrl: machinery.brochure_url ?? "",
      isActive: machinery.is_active,
      isFeatured: machinery.is_featured,
      seoTitle: machinery.seo_title ?? "",
      seoDescription: machinery.seo_description ?? "",
    },
  });

  const categoryId = watch("categoryId");
  const isActive = watch("isActive");
  const isFeatured = watch("isFeatured");
  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: MachineryInput) => {
    const result = await updateMachinery(machinery.id, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Machine saved");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Machine Details</CardTitle>
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

            <h3 className="text-sm font-semibold">Technical Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                <FieldContent>
                  <Input id="capacity" placeholder="e.g. 500 kg/hr" {...register("capacity")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="powerRequirement">Power Requirement</FieldLabel>
                <FieldContent>
                  <Input id="powerRequirement" placeholder="e.g. 15 kW" {...register("powerRequirement")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="dimensions">Dimensions</FieldLabel>
                <FieldContent>
                  <Input id="dimensions" placeholder="e.g. 4.2m x 1.1m x 1.8m" {...register("dimensions")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="weight">Weight</FieldLabel>
                <FieldContent>
                  <Input id="weight" placeholder="e.g. 1200 kg" {...register("weight")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="voltage">Voltage</FieldLabel>
                <FieldContent>
                  <Input id="voltage" placeholder="e.g. 380V / 3-phase" {...register("voltage")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="material">Material</FieldLabel>
                <FieldContent>
                  <Input id="material" placeholder="e.g. Stainless Steel 304" {...register("material")} />
                </FieldContent>
              </Field>
            </div>

            <Field data-invalid={!!errors.imageUrl}>
              <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
              <FieldContent>
                <Input id="imageUrl" placeholder="/machinery/example.jpg or https://..." {...register("imageUrl")} />
                <FieldError errors={[errors.imageUrl]} />
              </FieldContent>
            </Field>

            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Preview" className="h-32 w-32 rounded-md border object-cover" />
            )}

            <Field>
              <FieldLabel htmlFor="brochureUrl">Brochure URL</FieldLabel>
              <FieldContent>
                <Input id="brochureUrl" placeholder="Link to a PDF brochure" {...register("brochureUrl")} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
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
