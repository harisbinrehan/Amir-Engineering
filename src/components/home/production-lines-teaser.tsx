import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { productionLinesTeaser } from "@/lib/content/placeholder-copy";

export function ProductionLinesTeaser() {
  return (
    <Section variant="dark">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-industrial text-sm font-semibold tracking-wide uppercase">
            Production Lines
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {productionLinesTeaser.title}
          </h2>
          <p className="text-primary-foreground/80 mt-4 text-lg leading-relaxed">
            {productionLinesTeaser.body}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-industrial text-industrial-foreground hover:bg-industrial/90 mt-8"
          >
            <Link href={productionLinesTeaser.cta.href}>
              {productionLinesTeaser.cta.label}
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
          {productionLinesTeaser.stages.map((stage, index) => (
            <li
              key={stage}
              className="border-primary-foreground/15 bg-primary-foreground/5 flex items-center gap-3 rounded-lg border px-4 py-3"
            >
              <span className="bg-industrial text-industrial-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm font-medium">{stage}</span>
              {index === productionLinesTeaser.stages.length - 1 && (
                <CheckIcon className="text-industrial ml-auto size-4" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
