import type { Metadata } from "next";
import { PublicStubPage } from "@/components/common/public-stub-page";

export const metadata: Metadata = {
  title: "Food Products",
  description: "Noodles, macaroni, pasta and vermicelli products from Amir Engineering.",
};

export default function ProductsPage() {
  return (
    <PublicStubPage
      title="Food Products"
      description="Our full range of noodles, macaroni, pasta and vermicelli products — with search, filtering, cart and checkout — is launching soon."
      breadcrumbs={[{ label: "Food Products" }]}
    />
  );
}
