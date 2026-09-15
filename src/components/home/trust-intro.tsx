import { Section } from "@/components/layout/section";
import { StatsCounter } from "@/components/home/stats-counter";
import { trustIntro, trustStats } from "@/lib/content/placeholder-copy";

export function TrustIntro() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{trustIntro.title}</h2>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{trustIntro.body}</p>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
        {trustStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <dt className="font-heading text-industrial text-4xl font-bold sm:text-5xl">
              <StatsCounter value={stat.value} suffix={stat.suffix} />
            </dt>
            <dd className="text-muted-foreground mt-2 text-sm">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
