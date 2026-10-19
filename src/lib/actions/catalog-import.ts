"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { logAudit } from "@/lib/audit";
import { importRowSchema, IMPORT_CSV_COLUMNS, type ImportRowInput } from "@/lib/validation/catalog-import-schema";
import { slugify } from "@/lib/validation/product-schema";

const CATALOG_ROLES = ["super_admin", "admin"] as const;

function csvEscape(value: unknown) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function exportCatalogCsv(): Promise<string> {
  await requireRole([...CATALOG_ROLES]);
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("name, slug, base_price, is_active, is_featured, category:product_categories(name), variants:product_variants(*)")
    .is("deleted_at", null)
    .order("name");

  if (error) throw new Error(error.message);

  const rows: string[] = [IMPORT_CSV_COLUMNS.join(",")];

  for (const p of products) {
    const variants = p.variants.length > 0 ? p.variants : [null];
    for (const v of variants) {
      rows.push(
        [
          v?.sku ?? "",
          p.name,
          p.slug,
          p.category?.name ?? "",
          v?.label ?? "",
          p.base_price,
          v?.price ?? "",
          v?.stock_quantity ?? 0,
          v?.low_stock_threshold ?? 10,
          p.is_active,
          p.is_featured,
        ]
          .map(csvEscape)
          .join(","),
      );
    }
  }

  return rows.join("\n");
}

export type RowValidationResult = {
  index: number;
  row: ImportRowInput;
  valid: boolean;
  errors: string[];
  isUpdate: boolean;
};

/**
 * Validates only — never writes. Run server-side (never trust the client's
 * own parse/validate pass) before anything is shown as "ready to import".
 */
export async function validateImportRows(rows: ImportRowInput[]): Promise<RowValidationResult[]> {
  await requireRole([...CATALOG_ROLES]);
  const supabase = await createClient();

  const { data: existingVariants } = await supabase.from("product_variants").select("sku");
  const existingSkus = new Set((existingVariants ?? []).map((v) => v.sku));

  const seenInFile = new Set<string>();
  const results: RowValidationResult[] = [];

  rows.forEach((raw, index) => {
    const errors: string[] = [];
    const parsed = importRowSchema.safeParse(raw);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) errors.push(issue.message);
      results.push({ index, row: raw, valid: false, errors, isUpdate: false });
      return;
    }

    const sku = parsed.data.sku;
    if (seenInFile.has(sku)) {
      errors.push(`Duplicate SKU "${sku}" in this file`);
    }
    seenInFile.add(sku);

    results.push({
      index,
      row: raw,
      valid: errors.length === 0,
      errors,
      isUpdate: existingSkus.has(sku),
    });
  });

  return results;
}

export type ImportCommitResult = {
  sku: string;
  action: "created" | "updated" | "skipped";
  error?: string;
};

/**
 * Upserts by SKU — a repeat import of the same file updates existing rows
 * instead of duplicating them. Only called with rows that already passed
 * validateImportRows; re-validates shape server-side regardless.
 */
export async function commitImportRows(rows: ImportRowInput[]): Promise<ImportCommitResult[]> {
  const session = await requireRole([...CATALOG_ROLES]);
  const supabase = await createClient();
  const results: ImportCommitResult[] = [];

  for (const raw of rows) {
    const parsed = importRowSchema.safeParse(raw);
    if (!parsed.success) {
      results.push({ sku: String(raw.sku ?? "?"), action: "skipped", error: parsed.error.issues[0]?.message });
      continue;
    }
    const values = parsed.data;

    try {
      const { data: existingVariant } = await supabase
        .from("product_variants")
        .select("id, product_id")
        .eq("sku", values.sku)
        .maybeSingle();

      let productId: string;
      let categoryId: string | null = null;

      if (values.category) {
        const { data: cat } = await supabase
          .from("product_categories")
          .select("id")
          .ilike("name", values.category)
          .maybeSingle();
        categoryId = cat?.id ?? null;
      }

      if (existingVariant) {
        productId = existingVariant.product_id;
        await supabase
          .from("products")
          .update({
            name: values.product_name,
            base_price: values.base_price,
            is_active: values.is_active,
            is_featured: values.is_featured,
            ...(categoryId ? { category_id: categoryId } : {}),
          })
          .eq("id", productId);
        await supabase
          .from("product_variants")
          .update({
            label: values.variant_label || null,
            price: values.variant_price,
            stock_quantity: values.stock_quantity,
            low_stock_threshold: values.low_stock_threshold,
            is_active: values.is_active,
          })
          .eq("id", existingVariant.id);

        results.push({ sku: values.sku, action: "updated" });
      } else {
        const slug = values.product_slug || slugify(values.product_name);
        const { data: existingProduct } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();

        if (existingProduct) {
          productId = existingProduct.id;
        } else {
          const { data: newProduct, error: productError } = await supabase
            .from("products")
            .insert({
              name: values.product_name,
              slug,
              base_price: values.base_price,
              is_active: values.is_active,
              is_featured: values.is_featured,
              category_id: categoryId,
              created_by: session.profile.id,
            })
            .select("id")
            .single();
          if (productError) throw productError;
          productId = newProduct.id;
        }

        const { error: variantError } = await supabase.from("product_variants").insert({
          product_id: productId,
          sku: values.sku,
          label: values.variant_label || null,
          price: values.variant_price,
          stock_quantity: values.stock_quantity,
          low_stock_threshold: values.low_stock_threshold,
          is_active: values.is_active,
        });
        if (variantError) throw variantError;

        results.push({ sku: values.sku, action: "created" });
      }

      await logAudit({
        actorId: session.profile.id,
        action: "import",
        entityType: "product",
        entityId: productId,
        diff: { after: { sku: values.sku, stock_quantity: values.stock_quantity } },
      });
    } catch (err) {
      results.push({ sku: values.sku, action: "skipped", error: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return results;
}
