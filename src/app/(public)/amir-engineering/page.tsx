import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/home/stats-counter";
import { BrandLogo } from "@/components/icons/logo";
import { trustStats, aboutContent } from "@/lib/content/placeholder-copy";
import { businesses } from "@/lib/content/businesses";
import { siteConfig } from "@/lib/content/site-config";
import { getMachineryCategories } from "@/lib/data/machinery";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Amir Engineering — Machinery & Industrial Solutions",
  description:
    "Amir Engineering, established 2005 — industrial machinery, food-processing equipment, automation and complete production lines, engineered and manufactured in Pakistan.",
};

const capabilities = [
  "Industrial machinery",
  "Food-processing machinery",
  "Automation",
  "Manufacturing",
  "Industrial projects",
  "Machinery installation & commissioning",
  "Industrial services",
  "Complete production line engineering",
];

export default async function AmirEngineeringPage() {
  const categories = await getMachineryCategories();

  return (
    <>
      <section className="bg-surface-dark text-surface-dark-foreground relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/brand/amir-engineering-facility.jpg"
            alt="Amir Engineering facility"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="from-surface-dark via-surface-dark/95 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-surface-dark-foreground/70">
            <Breadcrumbs items={[{ label: "Amir Engineering" }]} />
          </div>
          <BrandLogo className="mt-8 h-16 rounded-md bg-white p-2" />
          <span className="text-industrial mt-6 inline-block text-sm font-semibold tracking-wide uppercase">
            {businesses.amirEngineering.sinceLabel}
          </span>
          <h1 className="font-heading mt-2 max-w-2xl text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            {businesses.amirEngineering.name}
          </h1>
          <p className="mt-3 text-lg font-medium">{businesses.amirEngineering.tagline}</p>
          <p className="text-surface-dark-foreground/80 mt-6 max-w-2xl text-lg leading-relaxed">
            {businesses.amirEngineering.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
              <Link href="/machinery">
                Explore Machinery
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-surface-dark-foreground/30 bg-transparent text-surface-dark-foreground hover:bg-surface-dark-foreground/10 hover:text-surface-dark-foreground"
            >
              <Link href="/quote/request">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">About Amir Engineering</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">{aboutContent.intro}</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">Our Mission</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">{aboutContent.mission}</p>
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

      <Section variant="muted">
        <h2 className="font-heading text-2xl font-bold tracking-tight">Engineering Capabilities</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          From individual machines to complete, turnkey production lines — engineered, manufactured and installed
          in-house.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => (
            <li key={item} className="border-border bg-card flex items-start gap-3 rounded-lg border p-4">
              <CheckIcon className="text-industrial mt-0.5 size-5 shrink-0" />
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">Machinery Categories</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              Explore machinery by category, or request a quote for your required capacity.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/machinery">
              View All Machinery
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/machinery/category/${category.slug}`}
              className="group border-border bg-card hover:border-industrial/60 rounded-lg border p-5 transition-colors"
            >
              <h3 className="font-heading group-hover:text-industrial text-base font-semibold">{category.name}</h3>
              {category.description && (
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </Section>

      <Section variant="muted">
        <h2 className="font-heading text-2xl font-bold tracking-tight">Our Facility</h2>
        <div className="relative mt-8 aspect-21/9 overflow-hidden rounded-xl">
          <Image
            src="/brand/amir-engineering-facility.jpg"
            alt="Amir Engineering facility"
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
      </Section>

      <Section>
        <h2 className="font-heading text-2xl font-bold tracking-tight">Get in Touch</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Reach out for machinery inquiries, production line consultations or industrial project discussions.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
            <Link href="/quote/request">Request a Quote</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={`tel:${siteConfig.contact.phone}`}>Call {siteConfig.contact.phone}</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Page</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
