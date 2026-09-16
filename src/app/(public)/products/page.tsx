import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { getProductCategories, getProducts } from "@/lib/data/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Food Products",
  description: "Noodles, macaroni, pasta and vermicelli products — order online with Cash on Delivery or Bank Transfer.",
};

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function ProductsGrid({ categoryFilter }: { categoryFilter?: string }) {
  const products = await getProducts(categoryFilter ? { categorySlug: categoryFilter } : undefined);

  if (products.length === 0) {
    return <EmptyState title="No products found" description="Try selecting a different category." />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const categoryFilter = typeof searchParams?.category === "string" ? searchParams.category : undefined;

  const categories = await getProductCategories();

  return (
    <>
      <Section className="pb-0" containerClassName="pb-8">
        <Breadcrumbs items={[{ label: "Food Products" }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Food Products</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
          Noodles, macaroni, pasta and vermicelli — order online with Cash on Delivery or Bank Transfer.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/products" scroll={false}>
            <Badge
              variant={!categoryFilter ? "default" : "secondary"}
              className={`px-3 py-1.5 text-sm font-normal transition-colors hover:bg-food hover:text-food-foreground ${
                !categoryFilter ? "bg-food text-food-foreground hover:bg-food/90" : ""
              }`}
            >
              All Products
            </Badge>
          </Link>

          {categories.map((category) => {
            const isActive = categoryFilter === category.slug;
            // Toggle filter: if already active, clicking again removes the filter
            const href = isActive ? "/products" : `/products?category=${category.slug}`;
            
            return (
              <Link key={category.id} href={href} scroll={false}>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={`px-3 py-1.5 text-sm font-normal transition-colors hover:bg-food hover:text-food-foreground ${
                    isActive ? "bg-food text-food-foreground hover:bg-food/90" : ""
                  }`}
                >
                  {category.name}
                </Badge>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="pt-0">
        <Suspense key={categoryFilter ?? "all"} fallback={<GridSkeleton />}>
          <ProductsGrid categoryFilter={categoryFilter} />
        </Suspense>
      </Section>
    </>
  );
}
