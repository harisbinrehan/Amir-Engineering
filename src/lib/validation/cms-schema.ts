import { z } from "zod";

export const testimonialSchema = z.object({
  authorName: z.string().trim().min(2).max(150),
  authorTitle: z.string().trim().max(150).optional().or(z.literal("")),
  companyName: z.string().trim().max(150).optional().or(z.literal("")),
  quote: z.string().trim().min(2).max(1000),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const faqSchema = z.object({
  question: z.string().trim().min(2).max(300),
  answer: z.string().trim().min(2).max(2000),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export type FaqInput = z.infer<typeof faqSchema>;
