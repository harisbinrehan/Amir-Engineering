import Link from "next/link";
import { Section } from "@/components/layout/section";
import { FadeUp } from "@/components/common/motion-wrapper";
import { Button } from "@/components/ui/button";
import { homeCta } from "@/lib/content/placeholder-copy";

export function CtaSection() {
  return (
    <Section className="border-border border-t">
      <FadeUp className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{homeCta.title}</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">{homeCta.body}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
            <Link href={homeCta.primaryCta.href}>{homeCta.primaryCta.label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={homeCta.secondaryCta.href}>{homeCta.secondaryCta.label}</Link>
          </Button>
        </div>
      </FadeUp>
    </Section>
  );
}
