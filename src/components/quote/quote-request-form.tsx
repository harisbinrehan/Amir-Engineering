"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { quoteRequestSchema, type QuoteRequestInput } from "@/lib/validation/quote-schema";
import { createQuoteRequest } from "@/lib/actions/quotes";

export function QuoteRequestForm({
  machineryId,
  productionLineId,
  subjectLabel,
}: {
  machineryId?: string;
  productionLineId?: string;
  subjectLabel?: string;
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteRequestInput>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: { quantity: 1, machineryId, productionLineId },
  });

  const onSubmit = async (values: QuoteRequestInput) => {
    setSubmitError(null);
    const result = await createQuoteRequest(values);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    router.push(`/quote/confirmation/${result.data.referenceNumber}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {subjectLabel && (
          <div className="bg-secondary/60 rounded-lg px-4 py-3 text-sm">
            Requesting a quote for <span className="font-semibold">{subjectLabel}</span>
          </div>
        )}

        <input type="hidden" {...register("machineryId")} />
        <input type="hidden" {...register("productionLineId")} />

        {/* Honeypot — hidden from real users, left blank; bots that autofill every input trip it. */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
            <FieldContent>
              <Input id="fullName" {...register("fullName")} autoComplete="name" />
              <FieldError errors={[errors.fullName]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.companyName}>
            <FieldLabel htmlFor="companyName">Company</FieldLabel>
            <FieldContent>
              <Input id="companyName" {...register("companyName")} autoComplete="organization" />
              <FieldError errors={[errors.companyName]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email *</FieldLabel>
            <FieldContent>
              <Input id="email" type="email" {...register("email")} autoComplete="email" />
              <FieldError errors={[errors.email]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Phone *</FieldLabel>
            <FieldContent>
              <Input id="phone" type="tel" {...register("phone")} autoComplete="tel" />
              <FieldError errors={[errors.phone]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.country}>
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <FieldContent>
              <Input id="country" {...register("country")} autoComplete="country-name" />
              <FieldError errors={[errors.country]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.city}>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <FieldContent>
              <Input id="city" {...register("city")} autoComplete="address-level2" />
              <FieldError errors={[errors.city]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.requiredCapacity}>
            <FieldLabel htmlFor="requiredCapacity">Required Capacity</FieldLabel>
            <FieldContent>
              <Input id="requiredCapacity" placeholder="e.g. 400 kg/hr" {...register("requiredCapacity")} />
              <FieldError errors={[errors.requiredCapacity]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.quantity}>
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <FieldContent>
              <Input id="quantity" type="number" min={1} {...register("quantity", { valueAsNumber: true })} />
              <FieldError errors={[errors.quantity]} />
            </FieldContent>
          </Field>
        </div>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <FieldContent>
            <Textarea
              id="message"
              rows={5}
              placeholder="Tell us more about your production requirements..."
              {...register("message")}
            />
            <FieldError errors={[errors.message]} />
          </FieldContent>
        </Field>

        {submitError && (
          <p role="alert" className="text-destructive text-sm">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="bg-industrial text-industrial-foreground hover:bg-industrial/90 w-fit"
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Submit Quote Request
        </Button>
      </FieldGroup>
    </form>
  );
}
