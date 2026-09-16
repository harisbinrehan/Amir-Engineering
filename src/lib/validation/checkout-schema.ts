import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  addressLine1: z.string().trim().min(4, "Enter your street address").max(200),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter your city").max(80),
  province: z.string().trim().max(80).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  // Honeypot: real users never fill this in; bots that autofill every field do.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const cartLineInputSchema = z.object({
  variantId: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string(),
  variantLabel: z.string().nullable(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().min(1).max(999),
});

export type CartLineInput = z.infer<typeof cartLineInputSchema>;
