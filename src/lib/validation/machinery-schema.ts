import { z } from "zod";

export const machinerySchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  categoryId: z.string().trim().min(1).or(z.literal("")),
  shortDescription: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  capacity: z.string().trim().max(120).optional().or(z.literal("")),
  powerRequirement: z.string().trim().max(120).optional().or(z.literal("")),
  dimensions: z.string().trim().max(120).optional().or(z.literal("")),
  weight: z.string().trim().max(120).optional().or(z.literal("")),
  voltage: z.string().trim().max(120).optional().or(z.literal("")),
  material: z.string().trim().max(120).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  brochureUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export type MachineryInput = z.infer<typeof machinerySchema>;

export const specificationSchema = z.object({
  specGroup: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(300),
  sortOrder: z.number().int().min(0),
});

export type SpecificationInput = z.infer<typeof specificationSchema>;
