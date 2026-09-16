import { z } from "zod";

export const productSchema = z.object({
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
  basePrice: z.number().min(0),
  imageUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export type ProductInput = z.infer<typeof productSchema>;

export const variantSchema = z.object({
  sku: z.string().trim().min(1).max(60),
  label: z.string().trim().max(100).optional().or(z.literal("")),
  price: z.number().min(0).optional().nullable(),
  weightGrams: z.number().int().min(0).optional().nullable(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0),
  isActive: z.boolean(),
});

export type VariantInput = z.infer<typeof variantSchema>;

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
