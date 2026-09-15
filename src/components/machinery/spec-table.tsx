import type { Tables } from "@/types/database.types";

type Spec = Tables<"machinery_specifications">;

export function SpecTable({ specifications }: { specifications: Spec[] }) {
  if (specifications.length === 0) return null;

  const groups = new Map<string, Spec[]>();
  for (const spec of specifications) {
    const group = groups.get(spec.spec_group) ?? [];
    group.push(spec);
    groups.set(spec.spec_group, group);
  }

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([group, specs]) => (
        <div key={group}>
          <h3 className="font-heading mb-3 text-sm font-semibold tracking-wide uppercase">{group}</h3>
          <dl className="divide-border border-border divide-y rounded-lg border">
            {specs
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((spec) => (
                <div key={spec.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right font-medium">{spec.value}</dd>
                </div>
              ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
