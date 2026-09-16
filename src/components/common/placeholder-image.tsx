import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  seed: string;
  width?: number;
  height?: number;
};

/**
 * Single chokepoint for placeholder imagery. Renders `src` when provided
 * (real photography); otherwise renders a neutral icon tile — never a random
 * stock photo, which can show completely unrelated subject matter (a coffee
 * cup, a forest) next to real machinery/product photography.
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
  if (!src) {
    return (
      <div
        data-placeholder-seed={seed}
        className={cn("bg-muted relative flex items-center justify-center overflow-hidden", fill ? "h-full w-full" : undefined, className)}
        style={fill ? undefined : { width, height }}
      >
        <ImageIcon className="text-muted-foreground/30 size-10" strokeWidth={1.25} aria-hidden="true" />
        {process.env.NODE_ENV !== "production" && (
          <span className="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
            Placeholder
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", fill ? "h-full w-full" : undefined)}>
      <Image src={src} alt={alt} className={cn(className)} width={fill ? undefined : width} height={fill ? undefined : height} fill={fill} {...props} />
    </div>
  );
}
