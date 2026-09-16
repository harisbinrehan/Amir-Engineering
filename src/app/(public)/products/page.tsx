import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { getProductCategories, getProducts } from "@/lib/data/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Food Products",
  description: "Noodles, macaroni, pasta and vermicelli products — order online with Cash on Delivery or Bank Transfer.",
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getProductCategories(), getProducts()]);

  return (
    <>
      <Section className="pb-0" containerClassName="pb-8">
        <Breadcrumbs items={[{ label: "Food Products" }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Food Products</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
          Noodles, macaroni, pasta and vermicelli — order online with Cash on Delivery or Bank Transfer.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/products/category/${category.slug}`}>
              <Badge
                variant="secondary"
                className="hover:bg-food hover:text-food-foreground px-3 py-1.5 text-sm font-normal transition-colors"
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        {products.length === 0 ? (
          <EmptyState title="No products published yet" description="Check back soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
