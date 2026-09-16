"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { Button } from "@/components/ui/button";
import { machineryCategoriesTeaser } from "@/lib/content/placeholder-copy";
import { realCategoryImagesBySlug } from "@/lib/content/real-machinery-media";

const MotionLink = motion.create(Link);

export function MachineryShowcase() {
  return (
    <Section variant="muted">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <span className="text-industrial text-sm font-semibold tracking-wide uppercase">Machinery</span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Engineered for Continuous Production
          </h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/machinery">
            View All Machinery
            <ArrowRightIcon />
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {machineryCategoriesTeaser.map((category) => (
          <MotionLink
            key={category.slug}
            href={`/machinery/category/${category.slug}`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="group border-border bg-card hover:border-industrial/60 flex flex-col overflow-hidden rounded-lg border transition-colors"
          >
            <div className="aspect-4/3 relative overflow-hidden">
              <PlaceholderImage
                src={realCategoryImagesBySlug[category.slug]}
                seed={category.slug}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="font-heading text-base font-semibold">{category.name}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{category.description}</p>
            </div>
          </MotionLink>
        ))}
      </motion.div>
    </Section>
  );
}
