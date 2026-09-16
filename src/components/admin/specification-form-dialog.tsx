"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { specificationSchema, type SpecificationInput } from "@/lib/validation/machinery-schema";
import { createSpecification, updateSpecification } from "@/lib/actions/machinery";
import type { getAdminMachineryById } from "@/lib/data/admin-machinery";

type Specification = NonNullable<Awaited<ReturnType<typeof getAdminMachineryById>>>["specifications"][number];

export function SpecificationFormDialog({
  machineryId,
  specification,
  trigger,
}: {
  machineryId: string;
  specification?: Specification;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!specification;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SpecificationInput>({
    resolver: zodResolver(specificationSchema),
    defaultValues: specification
      ? {
          specGroup: specification.spec_group,
          label: specification.label,
          value: specification.value,
          sortOrder: specification.sort_order,
        }
      : { specGroup: "General", sortOrder: 0 },
  });

  const onSubmit = async (values: SpecificationInput) => {
    const result = isEditing
      ? await updateSpecification(specification.id, machineryId, values)
      : await createSpecification(machineryId, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Specification updated" : "Specification added");
    setOpen(false);
    if (!isEditing) reset({ specGroup: "General", sortOrder: 0 });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <PlusIcon />
            Add Spec
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Specification" : "Add Specification"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.specGroup}>
              <FieldLabel htmlFor="specGroup">Group *</FieldLabel>
              <FieldContent>
                <Input id="specGroup" placeholder="e.g. Electrical, Mechanical" {...register("specGroup")} />
                <FieldError errors={[errors.specGroup]} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.label}>
                <FieldLabel htmlFor="label">Label *</FieldLabel>
                <FieldContent>
                  <Input id="label" placeholder="e.g. Motor Power" {...register("label")} />
                  <FieldError errors={[errors.label]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!errors.value}>
                <FieldLabel htmlFor="value">Value *</FieldLabel>
                <FieldContent>
                  <Input id="value" placeholder="e.g. 15 kW" {...register("value")} />
                  <FieldError errors={[errors.value]} />
                </FieldContent>
              </Field>
            </div>

            <Field data-invalid={!!errors.sortOrder}>
              <FieldLabel htmlFor="sortOrder">Sort Order</FieldLabel>
              <FieldContent>
                <Input id="sortOrder" type="number" min={0} {...register("sortOrder", { valueAsNumber: true })} />
                <FieldError errors={[errors.sortOrder]} />
              </FieldContent>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Specification"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
