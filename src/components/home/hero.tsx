"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundVideo } from "@/components/common/background-video";
import { homeHero } from "@/lib/content/placeholder-copy";

export function Hero() {
  return (
    <section className="bg-surface-dark text-surface-dark-foreground relative overflow-hidden">
      <div className="absolute inset-0">
        <BackgroundVideo priority />
        {/* One moderate flat tint (not a stack of them) — enough for the
            video's own baked-in captions to recede behind the headline and
            keep text readable, without hiding the video itself. Heavier
            fade at the bottom, where the CTAs sit, easing to clear at top. */}
        <div className="bg-surface-dark/40 absolute inset-0" />
        <div className="from-surface-dark via-surface-dark/30 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="text-industrial mb-4 inline-block text-sm font-semibold tracking-wide uppercase">
            {homeHero.eyebrow}
          </span>
          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {homeHero.title}
          </h1>
          <p className="text-surface-dark-foreground/80 mt-6 max-w-xl text-lg leading-relaxed">
            {homeHero.subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-industrial text-industrial-foreground hover:bg-industrial/90"
            >
              <Link href={homeHero.primaryCta.href}>
                {homeHero.primaryCta.label}
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-surface-dark-foreground/30 bg-transparent text-surface-dark-foreground hover:bg-surface-dark-foreground/10 hover:text-surface-dark-foreground"
            >
              <Link href={homeHero.secondaryCta.href}>{homeHero.secondaryCta.label}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
