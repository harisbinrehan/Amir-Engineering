import type { Metadata } from "next";
import Image from "next/image";
import { CheckIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { BackgroundVideo } from "@/components/common/background-video";
import { StatsCounter } from "@/components/home/stats-counter";
import { aboutContent } from "@/lib/content/placeholder-copy";
import { trustStats } from "@/lib/content/placeholder-copy";
import { factoryFloorImages } from "@/lib/content/real-machinery-media";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Amir Engineering — our mission, manufacturing capabilities and why manufacturers choose us.",
};

export default function AboutPage() {
  return (
    <>
      <Section containerClassName="max-w-3xl" className="pb-8">
        <Breadcrumbs items={[{ label: "About Us" }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">About Amir Engineering</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{aboutContent.intro}</p>
      </Section>

      <Section className="pt-0">
        {/* The source video is vertical (9:16) — sized to its native ratio
            here, instead of the wide 21:9 crop, so the full frame shows
            uncropped rather than trimming it down to a thin sliver. */}
        <div className="relative mx-auto aspect-9/16 w-full max-w-sm overflow-hidden rounded-xl sm:max-w-md">
          <BackgroundVideo />
        </div>
      </Section>

      <Section variant="muted">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">{aboutContent.mission}</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">Our Vision</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">{aboutContent.vision}</p>
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

      <Section>
        <h2 className="font-heading text-2xl font-bold tracking-tight">Why Manufacturers Choose Us</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {aboutContent.whyChooseUs.map((item) => (
            <li key={item} className="border-border flex items-start gap-3 rounded-lg border p-4">
              <CheckIcon className="text-industrial mt-0.5 size-5 shrink-0" />
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section variant="muted">
        <h2 className="font-heading text-2xl font-bold tracking-tight">Our Factory &amp; Workshop</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {factoryFloorImages.map((src) => (
            <div key={src} className="aspect-square relative overflow-hidden rounded-lg">
              <Image src={src} alt="Amir Engineering factory floor" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-heading text-2xl font-bold tracking-tight">Leadership Team</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="text-center">
              <div className="relative mx-auto aspect-square w-32 overflow-hidden rounded-full">
                <PlaceholderImage seed={`team-${index}`} alt="Team member" fill className="object-cover" />
              </div>
              <p className="font-heading mt-3 text-sm font-semibold">Team Member {index}</p>
              <p className="text-muted-foreground text-xs">Engineering &amp; Operations</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
