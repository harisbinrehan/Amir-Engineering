import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Gallery } from "@/components/machinery/gallery";
import { AddToCartForm } from "@/components/shop/add-to-cart-form";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/content/site-config";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/data/products";
import { realProductImagesBySlug } from "@/lib/content/real-product-media";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.short_description ?? undefined,
  };
}

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: product.category?.name,
    url: `${siteConfig.url}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.base_price,
      availability: product.variants.some((v) => v.stock_quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Section containerClassName="pb-0" className="pb-8">
        <Breadcrumbs
          items={[
            { label: "Food Products", href: "/products" },
            ...(product.category
              ? [{ label: product.category.name, href: `/products/category/${product.category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />
      </Section>

      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <Gallery seed={product.slug} name={product.name} images={realProductImagesBySlug[product.slug] ?? []} />

          <div>
            {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
            <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
            {product.short_description && (
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{product.short_description}</p>
            )}

            <AddToCartForm
              productId={product.id}
              productSlug={product.slug}
              productName={product.name}
              basePrice={product.base_price}
              variants={product.variants.map((v) => ({
                id: v.id,
                label: v.label,
                price: v.price,
                stock_quantity: v.stock_quantity,
              }))}
            />

            <p className="text-muted-foreground mt-6 text-sm">
              Payment: Cash on Delivery or Bank Transfer. Delivery details are confirmed after checkout.
            </p>
          </div>
        </div>

        {product.description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold tracking-tight">Overview</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>
          </div>
        )}
      </Section>

      {related.length > 0 && (
        <Section variant="muted">
          <h2 className="font-heading text-2xl font-bold tracking-tight">You May Also Like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
