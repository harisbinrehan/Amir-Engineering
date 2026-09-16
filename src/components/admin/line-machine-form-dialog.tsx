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
import { lineMachineSchema, type LineMachineInput } from "@/lib/validation/production-line-schema";
import { createLineMachine, updateLineMachine } from "@/lib/actions/production-lines";
import type { getAdminProductionLineById, getAdminMachineryOptions } from "@/lib/data/admin-production-lines";

type LineMachine = NonNullable<Awaited<ReturnType<typeof getAdminProductionLineById>>>["machines"][number];

export function LineMachineFormDialog({
  lineId,
  stages,
  machineryOptions,
  entry,
  trigger,
}: {
  lineId: string;
  stages: NonNullable<Awaited<ReturnType<typeof getAdminProductionLineById>>>["stages"];
  machineryOptions: Awaited<ReturnType<typeof getAdminMachineryOptions>>;
  entry?: LineMachine;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!entry;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LineMachineInput>({
    resolver: zodResolver(lineMachineSchema),
    defaultValues: entry
      ? {
          machineryId: entry.machinery_id,
          stageId: entry.stage_id ?? "",
          quantity: entry.quantity,
          sortOrder: entry.sort_order,
        }
      : { quantity: 1, sortOrder: 0 },
  });

  const machineryId = watch("machineryId");
  const stageId = watch("stageId");

  const onSubmit = async (values: LineMachineInput) => {
    const result = isEditing
      ? await updateLineMachine(entry.id, lineId, values)
      : await createLineMachine(lineId, values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Machine updated" : "Machine added");
    setOpen(false);
    if (!isEditing) reset({ quantity: 1, sortOrder: 0 });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <PlusIcon />
            Add Machine
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Included Machine" : "Add Machine to Line"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.machineryId}>
              <FieldLabel htmlFor="machineryId">Machine *</FieldLabel>
              <FieldContent>
                <Select value={machineryId} onValueChange={(v) => setValue("machineryId", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machineryOptions.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.machineryId]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="stageId">Stage</FieldLabel>
              <FieldContent>
                <Select value={stageId || "none"} onValueChange={(v) => setValue("stageId", v === "none" ? "" : v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No stage</SelectItem>
                    {stages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.quantity}>
                <FieldLabel htmlFor="quantity">Quantity *</FieldLabel>
                <FieldContent>
                  <Input id="quantity" type="number" min={1} {...register("quantity", { valueAsNumber: true })} />
                  <FieldError errors={[errors.quantity]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!errors.sortOrder}>
                <FieldLabel htmlFor="sortOrder">Sort Order</FieldLabel>
                <FieldContent>
                  <Input id="sortOrder" type="number" min={0} {...register("sortOrder", { valueAsNumber: true })} />
                  <FieldError errors={[errors.sortOrder]} />
                </FieldContent>
              </Field>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Machine"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
