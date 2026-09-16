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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { productionLineSchema, type ProductionLineInput } from "@/lib/validation/production-line-schema";
import { updateProductionLine } from "@/lib/actions/production-lines";
import type { getAdminProductionLineById } from "@/lib/data/admin-production-lines";

type ProductionLine = NonNullable<Awaited<ReturnType<typeof getAdminProductionLineById>>>;

export function ProductionLineEditForm({ line }: { line: ProductionLine }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductionLineInput>({
    resolver: zodResolver(productionLineSchema),
    defaultValues: {
      name: line.name,
      slug: line.slug,
      shortDescription: line.short_description ?? "",
      description: line.description ?? "",
      capacity: line.capacity ?? "",
      requiredSpace: line.required_space ?? "",
      powerRequirement: line.power_requirement ?? "",
      imageUrl: line.image_url ?? "",
      brochureUrl: line.brochure_url ?? "",
      isActive: line.is_active,
    },
  });

  const isActive = watch("isActive");
  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: ProductionLineInput) => {
    const result = await updateProductionLine(line.id, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Production line saved");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Line Details</CardTitle>
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

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                <FieldContent>
                  <Input id="capacity" placeholder="e.g. 1,000 kg/hr" {...register("capacity")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="requiredSpace">Required Space</FieldLabel>
                <FieldContent>
                  <Input id="requiredSpace" placeholder="e.g. 200 sq. meters" {...register("requiredSpace")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="powerRequirement">Power Requirement</FieldLabel>
                <FieldContent>
                  <Input id="powerRequirement" placeholder="e.g. 45 kW" {...register("powerRequirement")} />
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

            <div className="flex items-center gap-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
              <FieldLabel htmlFor="isActive">Active (visible on site)</FieldLabel>
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
