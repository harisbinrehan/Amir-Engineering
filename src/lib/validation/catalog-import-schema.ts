import { z } from "zod";

/**
 * One row per variant — matches the CSV export format exactly, so an
 * exported file can be edited and re-imported (upsert by SKU) without
 * reshaping it.
 */
export const importRowSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required").max(60),
  product_name: z.string().trim().min(2, "Product name is required").max(150),
  product_slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens")
    .optional()
    .or(z.literal("")),
  category: z.string().trim().optional().or(z.literal("")),
  variant_label: z.string().trim().max(100).optional().or(z.literal("")),
  base_price: z.coerce.number().min(0, "Base price must be 0 or more"),
  variant_price: z
    .union([z.coerce.number().min(0), z.literal(""), z.undefined()])
    .transform((v) => (v === "" || v === undefined ? null : v)),
  stock_quantity: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  low_stock_threshold: z.coerce.number().int().min(0).default(10),
  is_active: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === "boolean" ? v : ["true", "1", "yes", "active"].includes(v.trim().toLowerCase())))
    .default(true),
  is_featured: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === "boolean" ? v : ["true", "1", "yes"].includes(v.trim().toLowerCase())))
    .default(false),
});

export type ImportRowInput = z.input<typeof importRowSchema>;
export type ImportRow = z.infer<typeof importRowSchema>;

export const IMPORT_CSV_COLUMNS = [
  "sku",
  "product_name",
  "product_slug",
  "category",
  "variant_label",
  "base_price",
  "variant_price",
  "stock_quantity",
  "low_stock_threshold",
  "is_active",
  "is_featured",
] as const;
