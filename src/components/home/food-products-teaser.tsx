"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { foodProductsTeaser } from "@/lib/content/placeholder-copy";
import { genericNoodleBowlImage } from "@/lib/content/stock-images";

export function FoodProductsTeaser() {
  return (
    <Section>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid items-center gap-12 lg:grid-cols-2"
      >
        <div className="aspect-4/3 relative overflow-hidden rounded-xl">
          <PlaceholderImage
            src={genericNoodleBowlImage}
            seed="amir-food-teaser"
            alt="A bowl of noodles — illustrative photo, not a specific product"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <span className="text-food text-sm font-semibold tracking-wide uppercase">Food Products</span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {foodProductsTeaser.title}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{foodProductsTeaser.body}</p>
          <Button asChild size="lg" className="bg-food text-food-foreground hover:bg-food/90 mt-8">
            <Link href={foodProductsTeaser.cta.href}>
              {foodProductsTeaser.cta.label}
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
