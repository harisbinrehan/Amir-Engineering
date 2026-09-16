import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { PackageSearchIcon, SparklesIcon } from "lucide-react";
import { businesses } from "@/lib/content/businesses";

export const metadata: Metadata = {
  title: "Fine Foods Industries — Food Manufacturing & Consumer Products",
  description:
    "Fine Foods Industries, established 1988 — food manufacturing and consumer products, and the future home of an automated noodle production line.",
};

export default function FineFoodsPage() {
  return (
    <>
      <Section containerClassName="max-w-3xl" className="pb-8">
        <Breadcrumbs items={[{ label: "Fine Foods Industries" }]} />
        <span className="text-industrial mt-4 inline-block text-sm font-semibold tracking-wide uppercase">
          {businesses.fineFoods.sinceLabel}
        </span>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {businesses.fineFoods.name}
        </h1>
        <p className="mt-2 text-lg font-medium">{businesses.fineFoods.tagline}</p>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{businesses.fineFoods.description}</p>
      </Section>

      <Section variant="muted">
        <h2 className="font-heading text-2xl font-bold tracking-tight">Our Story</h2>
        <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
          Fine Foods Industries was established in 1988 as a food-related business, and represents the food
          manufacturing and consumer-products side of our business. Further company history, milestones and
          photography will be added here as they are confirmed.
        </p>
      </Section>

      <Section>
        <h2 className="font-heading text-2xl font-bold tracking-tight">The Next Chapter in Food Manufacturing</h2>
        <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
          Fine Foods Industries is developing a fully automated noodle production line as part of its continued
          investment in modern food-manufacturing capability. This is currently in development, and noodle
          products are not yet commercially available.
        </p>
      </Section>

      <Section variant="muted">
        <h2 className="font-heading text-2xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Our product catalogue is being prepared for launch on this site.
        </p>
        <EmptyState
          className="mt-8"
          icon={PackageSearchIcon}
          title="Product catalogue coming soon"
          description="Fine Foods Industries products will be presented here with official photography and packaging once available."
        />
      </Section>

      <Section>
        <h2 className="font-heading text-2xl font-bold tracking-tight">Future Consumer Brands</h2>
        <EmptyState
          icon={SparklesIcon}
          title="A new consumer brand is on the way"
          description="Fine Foods Industries is preparing to launch a dedicated consumer noodle brand. Details will be announced here once confirmed."
        />
      </Section>
    </>
  );
}
