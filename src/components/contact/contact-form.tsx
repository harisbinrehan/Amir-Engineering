"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { contactInquirySchema, type ContactInquiryInput } from "@/lib/validation/contact-schema";
import { createContactInquiry } from "@/lib/actions/contact";

export function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiryInput>({
    resolver: zodResolver(contactInquirySchema),
  });

  const onSubmit = async (values: ContactInquiryInput) => {
    setSubmitError(null);
    const result = await createContactInquiry(values);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="border-border bg-card flex flex-col items-center gap-3 rounded-lg border p-10 text-center">
        <CheckCircle2Icon className="text-industrial size-10" strokeWidth={1.5} />
        <h3 className="font-heading text-lg font-semibold">Message Sent</h3>
        <p className="text-muted-foreground text-sm">
          Thank you for reaching out. Our team will get back to you within one business day.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {/* Honeypot — hidden from real users, left blank; bots that autofill every input trip it. */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="contactFullName">Full Name *</FieldLabel>
            <FieldContent>
              <Input id="contactFullName" {...register("fullName")} autoComplete="name" />
              <FieldError errors={[errors.fullName]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="contactPhone">Phone</FieldLabel>
            <FieldContent>
              <Input id="contactPhone" type="tel" {...register("phone")} autoComplete="tel" />
              <FieldError errors={[errors.phone]} />
            </FieldContent>
          </Field>

          <Field className="sm:col-span-2" data-invalid={!!errors.email}>
            <FieldLabel htmlFor="contactEmail">Email *</FieldLabel>
            <FieldContent>
              <Input id="contactEmail" type="email" {...register("email")} autoComplete="email" />
              <FieldError errors={[errors.email]} />
            </FieldContent>
          </Field>

          <Field className="sm:col-span-2" data-invalid={!!errors.subject}>
            <FieldLabel htmlFor="contactSubject">Subject</FieldLabel>
            <FieldContent>
              <Input id="contactSubject" placeholder="e.g. Machinery inquiry, Food product order" {...register("subject")} />
              <FieldError errors={[errors.subject]} />
            </FieldContent>
          </Field>
        </div>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="contactMessage">Message *</FieldLabel>
          <FieldContent>
            <Textarea id="contactMessage" rows={5} placeholder="Tell us how we can help..." {...register("message")} />
            <FieldError errors={[errors.message]} />
          </FieldContent>
        </Field>

        {submitError && (
          <p role="alert" className="text-destructive text-sm">
            {submitError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="bg-industrial text-industrial-foreground hover:bg-industrial/90 w-fit">
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Send Message
        </Button>
      </FieldGroup>
    </form>
  );
}
