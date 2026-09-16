import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminProducts, getAdminProductCategories } from "@/lib/data/admin-products";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

async function ProductsList({ categoryId, search }: { categoryId: string; search: string }) {
  const products = await getAdminProducts({ categoryId: categoryId === "all" ? undefined : categoryId, search });
  return <ProductsTable products={products} />;
}

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  await requireRole(["super_admin", "admin"]);

  const params = await props.searchParams;
  const categoryId = typeof params.category === "string" ? params.category : "all";
  const search = typeof params.q === "string" ? params.q : "";

  const categories = await getAdminProductCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Food products, pricing, variants and inventory.
          </p>
        </div>
        <ProductFormDialog categories={categories} />
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/products?category=all${search ? `&q=${search}` : ""}`} scroll={false}>
            <Badge
              variant={categoryId === "all" ? "default" : "secondary"}
              className={cn("px-3 py-1.5 text-sm font-normal transition-colors hover:bg-food hover:text-food-foreground", categoryId === "all" && "bg-food text-food-foreground")}
            >
              All
            </Badge>
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/admin/products?category=${c.id}${search ? `&q=${search}` : ""}`} scroll={false}>
              <Badge
                variant={categoryId === c.id ? "default" : "secondary"}
                className={cn("px-3 py-1.5 text-sm font-normal transition-colors hover:bg-food hover:text-food-foreground", categoryId === c.id && "bg-food text-food-foreground")}
              >
                {c.name}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="category" value={categoryId} />
          <Input name="q" placeholder="Search products..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <Suspense key={categoryId + search} fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <ProductsList categoryId={categoryId} search={search} />
      </Suspense>
    </div>
  );
}
