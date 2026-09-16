"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/checkout-schema";
import { placeOrder } from "@/lib/actions/orders";
import { useCart } from "@/lib/cart/cart-context";
import { formatPkr } from "@/lib/utils/currency";
import { CartSkeleton } from "@/components/shop/cart-skeleton";

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, hydrated, clear } = useCart();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cod" },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (values: CheckoutInput) => {
    setSubmitError(null);

    if (lines.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    const result = await placeOrder({
      checkout: values,
      lines: lines.map((line) => ({
        variantId: line.variantId,
        productId: line.productId,
        productName: line.productName,
        variantLabel: line.variantLabel,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
      })),
    });

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    clear();
    router.push(`/order-confirmation/${result.data.orderNumber}`);
  };

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (lines.length === 0) {
    return (
      <div className="border-border rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="bg-food text-food-foreground hover:bg-food/90 mt-4">
          <Link href="/products">Shop Food Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="lg:col-span-2">
        <FieldGroup>
          {/* Honeypot — hidden from real users, left blank; bots that autofill every input trip it. */}
          <div className="hidden" aria-hidden="true">
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </label>
          </div>

          <h2 className="font-heading text-lg font-bold">Contact Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.fullName}>
              <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
              <FieldContent>
                <Input id="fullName" {...register("fullName")} autoComplete="name" />
                <FieldError errors={[errors.fullName]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">Phone *</FieldLabel>
              <FieldContent>
                <Input id="phone" type="tel" {...register("phone")} autoComplete="tel" />
                <FieldError errors={[errors.phone]} />
              </FieldContent>
            </Field>

            <Field className="sm:col-span-2" data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email *</FieldLabel>
              <FieldContent>
                <Input id="email" type="email" {...register("email")} autoComplete="email" />
                <FieldError errors={[errors.email]} />
              </FieldContent>
            </Field>
          </div>

          <h2 className="font-heading mt-4 text-lg font-bold">Shipping Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2" data-invalid={!!errors.addressLine1}>
              <FieldLabel htmlFor="addressLine1">Address Line 1 *</FieldLabel>
              <FieldContent>
                <Input id="addressLine1" {...register("addressLine1")} autoComplete="address-line1" />
                <FieldError errors={[errors.addressLine1]} />
              </FieldContent>
            </Field>

            <Field className="sm:col-span-2" data-invalid={!!errors.addressLine2}>
              <FieldLabel htmlFor="addressLine2">Address Line 2</FieldLabel>
              <FieldContent>
                <Input id="addressLine2" {...register("addressLine2")} autoComplete="address-line2" />
                <FieldError errors={[errors.addressLine2]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.city}>
              <FieldLabel htmlFor="city">City *</FieldLabel>
              <FieldContent>
                <Input id="city" {...register("city")} autoComplete="address-level2" />
                <FieldError errors={[errors.city]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.province}>
              <FieldLabel htmlFor="province">Province</FieldLabel>
              <FieldContent>
                <Input id="province" {...register("province")} autoComplete="address-level1" />
                <FieldError errors={[errors.province]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.postalCode}>
              <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
              <FieldContent>
                <Input id="postalCode" {...register("postalCode")} autoComplete="postal-code" />
                <FieldError errors={[errors.postalCode]} />
              </FieldContent>
            </Field>
          </div>

          <h2 className="font-heading mt-4 text-lg font-bold">Payment Method</h2>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setValue("paymentMethod", value as CheckoutInput["paymentMethod"])}
            className="gap-3"
          >
            <label className="border-border has-[[data-checked]]:border-food flex items-center gap-3 rounded-lg border p-4 text-sm">
              <RadioGroupItem value="cod" />
              <span>
                <span className="block font-medium">Cash on Delivery</span>
                <span className="text-muted-foreground">Pay in cash when your order arrives.</span>
              </span>
            </label>
            <label className="border-border has-[[data-checked]]:border-food flex items-center gap-3 rounded-lg border p-4 text-sm">
              <RadioGroupItem value="bank_transfer" />
              <span>
                <span className="block font-medium">Bank Transfer</span>
                <span className="text-muted-foreground">Bank details are shared after you place your order.</span>
              </span>
            </label>
          </RadioGroup>

          <Field data-invalid={!!errors.notes}>
            <FieldLabel htmlFor="notes">Order Notes</FieldLabel>
            <FieldContent>
              <Textarea id="notes" rows={3} placeholder="Delivery instructions, landmark, etc." {...register("notes")} />
              <FieldError errors={[errors.notes]} />
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
            className="bg-food text-food-foreground hover:bg-food/90 w-fit"
          >
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Place Order
          </Button>
        </FieldGroup>
      </form>

      <div className="border-border bg-card h-fit rounded-lg border p-6">
        <h2 className="font-heading text-lg font-bold">Order Summary</h2>
        <div className="divide-border mt-4 divide-y">
          {lines.map((line) => (
            <div key={line.variantId} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium">{line.productName}</p>
                {line.variantLabel && <p className="text-muted-foreground text-xs">{line.variantLabel}</p>}
                <p className="text-muted-foreground text-xs">Qty {line.quantity}</p>
              </div>
              <p className="shrink-0 font-semibold">{formatPkr(line.unitPrice * line.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-border mt-4 flex items-center justify-between border-t pt-4 text-sm font-semibold">
          <span>Total</span>
          <span>{formatPkr(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
