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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { testimonialSchema, type TestimonialInput } from "@/lib/validation/cms-schema";
import { createTestimonial, updateTestimonial } from "@/lib/actions/cms";
import type { getAdminTestimonials } from "@/lib/data/admin-cms";

type Testimonial = Awaited<ReturnType<typeof getAdminTestimonials>>[number];

export function TestimonialFormDialog({
  testimonial,
  trigger,
}: {
  testimonial?: Testimonial;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!testimonial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial
      ? {
          authorName: testimonial.author_name,
          authorTitle: testimonial.author_title ?? "",
          companyName: testimonial.company_name ?? "",
          quote: testimonial.quote,
          rating: testimonial.rating,
          isPublished: testimonial.is_published,
          sortOrder: testimonial.sort_order,
        }
      : { isPublished: true, sortOrder: 0, rating: 5 },
  });

  const isPublished = watch("isPublished");
  const rating = watch("rating");

  const onSubmit = async (values: TestimonialInput) => {
    const result = isEditing
      ? await updateTestimonial(testimonial.id, values)
      : await createTestimonial(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Testimonial updated" : "Testimonial added");
    setOpen(false);
    if (!isEditing) reset({ isPublished: true, sortOrder: 0, rating: 5 });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
            <PlusIcon />
            Add Testimonial
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.authorName}>
                <FieldLabel htmlFor="authorName">Author Name *</FieldLabel>
                <FieldContent>
                  <Input id="authorName" {...register("authorName")} />
                  <FieldError errors={[errors.authorName]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="authorTitle">Author Title</FieldLabel>
                <FieldContent>
                  <Input id="authorTitle" placeholder="e.g. Operations Manager" {...register("authorTitle")} />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
              <FieldContent>
                <Input id="companyName" {...register("companyName")} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.quote}>
              <FieldLabel htmlFor="quote">Quote *</FieldLabel>
              <FieldContent>
                <Textarea id="quote" rows={4} {...register("quote")} />
                <FieldError errors={[errors.quote]} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="rating">Rating</FieldLabel>
                <FieldContent>
                  <Select
                    value={rating != null ? String(rating) : "none"}
                    onValueChange={(v) => setValue("rating", v === "none" ? null : Number(v))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No rating</SelectItem>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          {r} star{r > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <div className="flex items-center gap-2">
              <Switch id="isPublished" checked={isPublished} onCheckedChange={(v) => setValue("isPublished", v)} />
              <FieldLabel htmlFor="isPublished">Published</FieldLabel>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Testimonial"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
