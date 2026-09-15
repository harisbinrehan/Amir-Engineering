"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { cn } from "@/lib/utils";

export function Gallery({ seed, name, images }: { seed: string; name: string; images: string[] }) {
  const slides = images.length > 0 ? images : [null, null, null];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="bg-muted aspect-4/3 relative overflow-hidden rounded-xl">
        <PlaceholderImage
          src={slides[active] ?? undefined}
          seed={`${seed}-${active}`}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {slides.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {slides.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "ring-border relative aspect-square overflow-hidden rounded-md ring-1",
                active === index && "ring-industrial ring-2",
              )}
              aria-label={`Show image ${index + 1}`}
            >
              <PlaceholderImage
                src={src ?? undefined}
                seed={`${seed}-${index}`}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
