"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { stageSchema, type StageInput } from "@/lib/validation/production-line-schema";
import { createStage, updateStage } from "@/lib/actions/production-lines";
import type { getAdminProductionLineById } from "@/lib/data/admin-production-lines";

type Stage = NonNullable<Awaited<ReturnType<typeof getAdminProductionLineById>>>["stages"][number];

export function StageFormDialog({
  lineId,
  stage,
  trigger,
}: {
  lineId: string;
  stage?: Stage;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!stage;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StageInput>({
    resolver: zodResolver(stageSchema),
    defaultValues: stage
      ? { name: stage.name, description: stage.description ?? "", sortOrder: stage.sort_order }
      : { sortOrder: 0 },
  });

  const onSubmit = async (values: StageInput) => {
    const result = isEditing ? await updateStage(stage.id, lineId, values) : await createStage(lineId, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Stage updated" : "Stage added");
    setOpen(false);
    if (!isEditing) reset({ sortOrder: 0 });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <PlusIcon />
            Add Stage
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Stage" : "Add Stage"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name *</FieldLabel>
              <FieldContent>
                <Input id="name" placeholder="e.g. Mixing" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <FieldContent>
                <Textarea id="description" rows={2} {...register("description")} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.sortOrder}>
              <FieldLabel htmlFor="sortOrder">Sort Order</FieldLabel>
              <FieldContent>
                <Input id="sortOrder" type="number" min={0} {...register("sortOrder", { valueAsNumber: true })} />
                <FieldError errors={[errors.sortOrder]} />
              </FieldContent>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Stage"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
