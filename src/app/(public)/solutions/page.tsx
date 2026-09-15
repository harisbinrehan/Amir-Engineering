import type { Metadata } from "next";
import { PublicStubPage } from "@/components/common/public-stub-page";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Industry solutions from Amir Engineering for food manufacturers.",
};

export default function SolutionsPage() {
  return (
    <PublicStubPage
      title="Solutions"
      description="Tailored solutions by production capacity, budget and facility size — this section is being built out."
      breadcrumbs={[{ label: "Solutions" }]}
    />
  );
}
