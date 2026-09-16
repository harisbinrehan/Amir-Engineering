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
import { productionLineSchema, type ProductionLineInput } from "@/lib/validation/production-line-schema";
import { slugify } from "@/lib/validation/product-schema";
import { createProductionLine } from "@/lib/actions/production-lines";

export function ProductionLineFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductionLineInput>({
    resolver: zodResolver(productionLineSchema),
    defaultValues: { name: "", slug: "", isActive: true },
  });

  const onSubmit = async (values: ProductionLineInput) => {
    const result = await createProductionLine(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Production line created");
    setOpen(false);
    reset();
    setSlugTouched(false);
    router.push(`/admin/production-lines/${result.data.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
          <PlusIcon />
          Add Production Line
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Production Line</DialogTitle>
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
