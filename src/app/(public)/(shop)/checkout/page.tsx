import type { Metadata } from "next";
import { PublicStubPage } from "@/components/common/public-stub-page";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <PublicStubPage
      title="Checkout"
      description="Checkout with Cash on Delivery and Bank Transfer ships alongside the Food Products shop."
      breadcrumbs={[{ label: "Checkout" }]}
    />
  );
}
