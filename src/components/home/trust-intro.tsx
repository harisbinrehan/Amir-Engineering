import Image from "next/image";
import { Section } from "@/components/layout/section";
import { StatsCounter } from "@/components/home/stats-counter";
import { trustIntro, trustStats } from "@/lib/content/placeholder-copy";

export function TrustIntro() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{trustIntro.title}</h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{trustIntro.body}</p>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-xl">
          <Image
            src="/brand/amir-engineering-facility.jpg"
            alt="Amir Engineering facility"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
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
