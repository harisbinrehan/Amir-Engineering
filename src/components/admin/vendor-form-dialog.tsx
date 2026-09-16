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
import { vendorSchema, type VendorInput } from "@/lib/validation/vendor-schema";
import { createVendor, updateVendor } from "@/lib/actions/vendors";
import type { getVendors } from "@/lib/data/expenses";

type Vendor = Awaited<ReturnType<typeof getVendors>>[number];

export function VendorFormDialog({ vendor, trigger }: { vendor?: Vendor; trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!vendor;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VendorInput>({
    resolver: zodResolver(vendorSchema),
    defaultValues: vendor
      ? {
          name: vendor.name,
          contactPerson: vendor.contact_person ?? "",
          phone: vendor.phone ?? "",
          email: vendor.email ?? "",
          notes: vendor.notes ?? "",
        }
      : {},
  });

  const onSubmit = async (values: VendorInput) => {
    const result = isEditing ? await updateVendor(vendor.id, values) : await createVendor(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Vendor updated" : "Vendor added");
    setOpen(false);
    if (!isEditing) reset({});
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
            <PlusIcon />
            Add Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name *</FieldLabel>
              <FieldContent>
                <Input id="name" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="contactPerson">Contact Person</FieldLabel>
                <FieldContent>
                  <Input id="contactPerson" {...register("contactPerson")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <FieldContent>
                  <Input id="phone" {...register("phone")} />
                </FieldContent>
              </Field>
            </div>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <Input id="email" type="email" {...register("email")} />
                <FieldError errors={[errors.email]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <FieldContent>
                <Textarea id="notes" rows={3} {...register("notes")} />
              </FieldContent>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Vendor"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
