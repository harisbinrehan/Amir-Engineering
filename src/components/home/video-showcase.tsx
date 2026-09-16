"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { PlayIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import { machineryVideos } from "@/lib/content/videos";

export function VideoShowcase() {
  const [activeId, setActiveId] = useState(machineryVideos[0].id);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const active = machineryVideos.find((video) => video.id === activeId) ?? machineryVideos[0];
  const others = machineryVideos.filter((video) => video.id !== activeId);

  const selectVideo = (id: string) => {
    setActiveId(id);
    setPlayingId(null);
  };

  return (
    <Section variant="dark" className="border-surface-dark-foreground/10 border-b">
      <div className="max-w-2xl">
        <span className="text-industrial text-sm font-semibold tracking-wide uppercase">
          Engineering in Motion
        </span>
        <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          See Amir Engineering Machinery in Operation
        </h2>
        <p className="text-surface-dark-foreground/80 mt-4 text-lg leading-relaxed">
          Real machines, running in real production environments — as featured in independent industry
          coverage across Pakistan.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-background/5 relative aspect-video overflow-hidden rounded-xl"
            >
              {playingId === active.id ? (
                <iframe
                  className="absolute inset-0 size-full"
                  src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayingId(active.id)}
                  className="group absolute inset-0 size-full cursor-pointer"
                  aria-label={`Play video: ${active.title}`}
                >
                  <Image
                    src={active.thumbnail}
                    alt={active.title}
                    fill
                    sizes="(min-width: 1024px) 75vw, 100vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
                  <span className="bg-industrial text-industrial-foreground absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110 sm:size-20">
                    <PlayIcon className="ml-1 size-7 fill-current sm:size-8" />
                  </span>
                </button>
              )}
            </motion.div>
          </AnimatePresence>

          {playingId !== active.id && (
            <div className="mt-3">
              <p className="line-clamp-1 text-sm font-medium">{active.title}</p>
              <p className="text-surface-dark-foreground/60 text-xs">Featured by {active.channel} on YouTube</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
          {others.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => selectVideo(video.id)}
              className={cn(
                "group border-surface-dark-foreground/10 hover:border-industrial/60 relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg border transition-colors lg:w-auto",
              )}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="(min-width: 1024px) 22vw, 160px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
              <span className="bg-background/90 text-foreground absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full">
                <PlayIcon className="ml-0.5 size-3.5 fill-current" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
