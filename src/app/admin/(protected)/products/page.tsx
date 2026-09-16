import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminProducts, getAdminProductCategories } from "@/lib/data/admin-products";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  await requireRole(["super_admin", "admin"]);

  const params = await props.searchParams;
  const categoryId = typeof params.category === "string" ? params.category : "all";
  const search = typeof params.q === "string" ? params.q : "";

  const [products, categories] = await Promise.all([
    getAdminProducts({ categoryId: categoryId === "all" ? undefined : categoryId, search }),
    getAdminProductCategories(),
  ]);

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
          <a href={`/admin/products?category=all${search ? `&q=${search}` : ""}`}>
            <Badge
              variant={categoryId === "all" ? "default" : "secondary"}
              className={cn("px-3 py-1.5 text-sm font-normal", categoryId === "all" && "bg-food text-food-foreground")}
            >
              All
            </Badge>
          </a>
          {categories.map((c) => (
            <a key={c.id} href={`/admin/products?category=${c.id}${search ? `&q=${search}` : ""}`}>
              <Badge
                variant={categoryId === c.id ? "default" : "secondary"}
                className={cn("px-3 py-1.5 text-sm font-normal", categoryId === c.id && "bg-food text-food-foreground")}
              >
                {c.name}
              </Badge>
            </a>
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

      <ProductsTable products={products} />
    </div>
  );
}
