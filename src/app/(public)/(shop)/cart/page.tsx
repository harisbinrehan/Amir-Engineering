import type { Metadata } from "next";
import { PublicStubPage } from "@/components/common/public-stub-page";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <PublicStubPage
      title="Your Cart"
      description="Cart and checkout ship alongside the Food Products shop in a future build."
      breadcrumbs={[{ label: "Cart" }]}
    />
  );
}
