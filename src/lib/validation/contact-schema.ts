import { z } from "zod";

export const contactInquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  // Honeypot — real users never fill this in; bots that autofill every field do.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
