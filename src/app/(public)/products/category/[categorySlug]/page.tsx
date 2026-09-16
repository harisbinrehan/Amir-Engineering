import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/shop/product-card";
import { EmptyState } from "@/components/common/empty-state";
import { getProductCategoryBySlug, getProducts } from "@/lib/data/products";

export async function generateMetadata(props: PageProps<"/products/category/[categorySlug]">): Promise<Metadata> {
  const { categorySlug } = await props.params;
  const category = await getProductCategoryBySlug(categorySlug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function ProductCategoryPage(props: PageProps<"/products/category/[categorySlug]">) {
  const { categorySlug } = await props.params;
  const category = await getProductCategoryBySlug(categorySlug);
  if (!category) notFound();

  const products = await getProducts({ categorySlug });

  return (
    <>
      <Section className="pb-0" containerClassName="pb-8">
        <Breadcrumbs items={[{ label: "Food Products", href: "/products" }, { label: category.name }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg">{category.description}</p>
        )}
      </Section>

      <Section className="pt-0">
        {products.length === 0 ? (
          <EmptyState title="No products in this category yet" description="Check back soon." />
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
