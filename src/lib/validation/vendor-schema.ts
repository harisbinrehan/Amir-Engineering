import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().trim().min(2).max(150),
  contactPerson: z.string().trim().max(150).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type VendorInput = z.infer<typeof vendorSchema>;
