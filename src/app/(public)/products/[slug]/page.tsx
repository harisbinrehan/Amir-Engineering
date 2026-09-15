import type { Metadata } from "next";
import { PublicStubPage } from "@/components/common/public-stub-page";

export const metadata: Metadata = { title: "Product" };

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;

  return (
    <PublicStubPage
      title="Product Details"
      description={`The product page for "${slug}" is coming soon as part of the food products shop.`}
      breadcrumbs={[{ label: "Food Products", href: "/products" }, { label: slug }]}
    />
  );
}
