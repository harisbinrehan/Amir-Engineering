"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { projectsTeaser } from "@/lib/content/placeholder-copy";

const placeholderProjects = [
  { name: "Al-Noor Foods", location: "Lahore, Pakistan", machinery: "Complete Noodle Production Line" },
  { name: "Khan Pasta Mills", location: "Karachi, Pakistan", machinery: "Macaroni Extrusion Machine" },
  { name: "Gulf Vermicelli Co.", location: "Dubai, UAE", machinery: "Vermicelli Processing Line" },
];

export function ProjectsTeaser() {
  return (
    <Section>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <span className="text-industrial text-sm font-semibold tracking-wide uppercase">Projects</span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {projectsTeaser.title}
          </h2>
        </div>
        <Button variant="outline" asChild>
          <Link href={projectsTeaser.cta.href}>
            {projectsTeaser.cta.label}
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
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {placeholderProjects.map((project) => (
          <motion.div 
            key={project.name} 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="border-border bg-card overflow-hidden rounded-lg border"
          >
            <div className="aspect-4/3 relative overflow-hidden">
              <PlaceholderImage seed={project.name} alt={project.name} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-heading text-base font-semibold">{project.name}</h3>
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                <MapPinIcon className="size-3.5" />
                {project.location}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">{project.machinery}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
