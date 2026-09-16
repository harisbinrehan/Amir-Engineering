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
import { machinerySchema, type MachineryInput } from "@/lib/validation/machinery-schema";
import { slugify } from "@/lib/validation/product-schema";
import { createMachinery } from "@/lib/actions/machinery";
import type { getAdminMachineryCategories } from "@/lib/data/admin-machinery";

export function MachineryFormDialog({
  categories,
}: {
  categories: Awaited<ReturnType<typeof getAdminMachineryCategories>>;
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
  } = useForm<MachineryInput>({
    resolver: zodResolver(machinerySchema),
    defaultValues: { name: "", slug: "", categoryId: "", isActive: true, isFeatured: false },
  });

  const categoryId = watch("categoryId");

  const onSubmit = async (values: MachineryInput) => {
    const result = await createMachinery(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Machine created");
    setOpen(false);
    reset();
    setSlugTouched(false);
    router.push(`/admin/machinery/${result.data.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
          <PlusIcon />
          Add Machine
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Machine</DialogTitle>
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
                <Input id="slug" {...register("slug", { onChange: () => setSlugTouched(true) })} />
                <FieldError errors={[errors.slug]} />
              </FieldContent>
            </Field>

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
