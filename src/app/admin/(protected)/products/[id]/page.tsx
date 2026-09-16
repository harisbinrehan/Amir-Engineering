import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { VariantsTable } from "@/components/admin/variants-table";
import { VariantFormDialog } from "@/components/admin/variant-form-dialog";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminProductById, getAdminProductCategories } from "@/lib/data/admin-products";

export const metadata: Metadata = { title: "Product Detail" };

export default async function AdminProductDetailPage(props: PageProps<"/admin/products/[id]">) {
  await requireRole(["super_admin", "admin"]);

  const { id } = await props.params;
  const [product, categories] = await Promise.all([getAdminProductById(id), getAdminProductCategories()]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link href="/admin/products" className="text-muted-foreground inline-flex items-center gap-1 text-sm hover:underline">
            <ArrowLeftIcon className="size-3.5" />
            Back to Products
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{product.name}</h1>
            <Badge variant={product.is_active ? "default" : "secondary"} className="font-normal">
              {product.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <DeleteProductButton productId={product.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductEditForm product={product} categories={categories} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Variants</CardTitle>
              <VariantFormDialog productId={product.id} />
            </CardHeader>
            <CardContent>
              <VariantsTable productId={product.id} variants={product.variants} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
