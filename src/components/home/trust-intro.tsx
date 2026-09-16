"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Section } from "@/components/layout/section";
import { StatsCounter } from "@/components/home/stats-counter";
import { trustIntro, trustStats } from "@/lib/content/placeholder-copy";

export function TrustIntro() {
  return (
    <Section>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-black shadow-2xl flex flex-col justify-end sm:justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[650px]"
      >
        <Image
          src="/brand/amir-engineering-facility.jpg"
          alt="Amir Engineering facility"
          fill
          sizes="(min-width: 1024px) 100vw, 100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent sm:bg-gradient-to-r sm:from-black/95 sm:via-black/70 sm:to-transparent" />
        
        <div className="relative z-10 p-8 pt-20 sm:p-12 lg:p-20 max-w-2xl text-white mt-auto sm:mt-0">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {trustIntro.title}
          </h2>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl leading-relaxed text-gray-200">
            {trustIntro.body}
          </p>
        </div>
      </motion.div>

      <motion.dl 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
        className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
      >
        {trustStats.map((stat) => (
          <motion.div 
            key={stat.label} 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="text-center"
          >
            <dt className="font-heading text-industrial text-4xl font-bold sm:text-5xl">
              <StatsCounter value={stat.value} suffix={stat.suffix} />
            </dt>
            <dd className="text-muted-foreground mt-2 text-sm">{stat.label}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </Section>
  );
}
