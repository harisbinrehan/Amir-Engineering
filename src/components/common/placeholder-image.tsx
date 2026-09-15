import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type PlaceholderImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  seed: string;
  width?: number;
  height?: number;
};

/**
 * Single chokepoint for placeholder imagery. Renders `src` when provided
 * (real photography), otherwise falls back to a deterministic seeded
 * placeholder and marks itself so nothing placeholder-y ships unnoticed.
 */
export function PlaceholderImage({
  src,
  seed,
  alt,
  className,
  width = 1200,
  height = 800,
  fill,
  ...props
}: PlaceholderImageProps) {
  const isPlaceholder = !src;
  const resolvedSrc = src ?? `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;

  return (
    <div className={cn("relative overflow-hidden", fill ? "h-full w-full" : undefined)}>
      <Image
        src={resolvedSrc}
        alt={alt}
        className={cn(className)}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        {...props}
      />
      {isPlaceholder && process.env.NODE_ENV !== "production" && (
        <span className="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
          Placeholder
        </span>
      )}
    </div>
  );
}
