import { z } from "zod";
import { idSchema } from "@/lib/validation/id-schema";

export const quoteRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  companyName: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  requiredCapacity: z.string().trim().max(160).optional().or(z.literal("")),
  quantity: z.number().int().min(1).max(1000),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Hidden <input type="hidden"> fields submit "" (not undefined) when
  // unset — idSchema alone rejects that empty string with zero visible UI
  // (these fields have no <FieldError>), silently failing every submission.
  machineryId: idSchema.optional().or(z.literal("")),
  productionLineId: idSchema.optional().or(z.literal("")),
  // Honeypot: real users never fill this in; bots that autofill every field do.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
