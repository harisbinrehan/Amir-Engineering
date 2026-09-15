import { MachineryCard } from "@/components/machinery/machinery-card";
import { Section } from "@/components/layout/section";

type RelatedItem = Parameters<typeof MachineryCard>[0]["machinery"];

export function RelatedMachinery({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section variant="muted">
      <h2 className="font-heading text-2xl font-bold tracking-tight">Related Machinery</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MachineryCard key={item.slug} machinery={item} />
        ))}
      </div>
    </Section>
  );
}
