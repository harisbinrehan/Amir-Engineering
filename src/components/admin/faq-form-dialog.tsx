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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { faqSchema, type FaqInput } from "@/lib/validation/cms-schema";
import { createFaq, updateFaq } from "@/lib/actions/cms";
import type { getAdminFaqs } from "@/lib/data/admin-cms";

type Faq = Awaited<ReturnType<typeof getAdminFaqs>>[number];

export function FaqFormDialog({ faq, trigger }: { faq?: Faq; trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEditing = !!faq;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: faq
      ? {
          question: faq.question,
          answer: faq.answer,
          category: faq.category ?? "",
          isPublished: faq.is_published,
          sortOrder: faq.sort_order,
        }
      : { isPublished: true, sortOrder: 0 },
  });

  const isPublished = watch("isPublished");

  const onSubmit = async (values: FaqInput) => {
    const result = isEditing ? await updateFaq(faq.id, values) : await createFaq(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "FAQ updated" : "FAQ added");
    setOpen(false);
    if (!isEditing) reset({ isPublished: true, sortOrder: 0 });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
            <PlusIcon />
            Add FAQ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.question}>
              <FieldLabel htmlFor="question">Question *</FieldLabel>
              <FieldContent>
                <Input id="question" {...register("question")} />
                <FieldError errors={[errors.question]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.answer}>
              <FieldLabel htmlFor="answer">Answer *</FieldLabel>
              <FieldContent>
                <Textarea id="answer" rows={4} {...register("answer")} />
                <FieldError errors={[errors.answer]} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <FieldContent>
                  <Input id="category" placeholder="e.g. Machinery, Orders" {...register("category")} />
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
              {isEditing ? "Save Changes" : "Add FAQ"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
