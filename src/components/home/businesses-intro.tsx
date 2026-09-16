"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { Button } from "@/components/ui/button";
import { businesses } from "@/lib/content/businesses";
import { genericNoodleBowlImage } from "@/lib/content/stock-images";

export function BusinessesIntro() {
  return (
    <Section>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-industrial text-sm font-semibold tracking-wide uppercase">Our Businesses</span>
        <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Two Distinct Identities, One Shared Standard of Quality
        </h2>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
        }}
        className="mt-12 grid gap-6 md:grid-cols-2"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="border-border bg-card group flex flex-col overflow-hidden rounded-xl border"
        >
          <div className="bg-muted aspect-16/9 relative overflow-hidden">
            <PlaceholderImage
              src={genericNoodleBowlImage}
              seed="fine-foods-industries"
              alt="Fine Foods Industries — illustrative photo, official imagery coming soon"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              {businesses.fineFoods.sinceLabel}
            </span>
            <h3 className="font-heading mt-1 text-2xl font-bold tracking-tight">{businesses.fineFoods.name}</h3>
            <p className="text-industrial mt-1 text-sm font-medium">{businesses.fineFoods.tagline}</p>
            <p className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed">
              {businesses.fineFoods.description}
            </p>
            <Button variant="outline" asChild className="mt-6 self-start">
              <Link href={businesses.fineFoods.href}>
                {businesses.fineFoods.ctaLabel}
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="border-border bg-card group flex flex-col overflow-hidden rounded-xl border"
        >
          <div className="bg-muted aspect-16/9 relative overflow-hidden">
            <Image
              src="/machinery/macaroni-line-01.jpg"
              alt="Amir Engineering machinery"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              {businesses.amirEngineering.sinceLabel}
            </span>
            <h3 className="font-heading mt-1 text-2xl font-bold tracking-tight">{businesses.amirEngineering.name}</h3>
            <p className="text-industrial mt-1 text-sm font-medium">{businesses.amirEngineering.tagline}</p>
            <p className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed">
              {businesses.amirEngineering.description}
            </p>
            <Button asChild className="bg-industrial text-industrial-foreground hover:bg-industrial/90 mt-6 self-start">
              <Link href={businesses.amirEngineering.href}>
                {businesses.amirEngineering.ctaLabel}
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
