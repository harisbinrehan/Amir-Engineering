import { PlaceholderImage } from "@/components/common/placeholder-image";
import { cn } from "@/lib/utils";

const HERO_VIDEO_POSTER = "/video/hero-poster.jpg";

/**
 * Shared looping background-video treatment (homepage hero, About page
 * facility showcase, …). Poster always renders behind the video — it's
 * what shows under prefers-reduced-motion and before the video has
 * buffered enough to paint. object-top keeps the logo/captions near the
 * top of the source footage from being cropped away; cover trims the
 * bottom instead.
 */
export function BackgroundVideo({ priority = false, className }: { priority?: boolean; className?: string }) {
  return (
    <>
      <PlaceholderImage
        src={HERO_VIDEO_POSTER}
        seed="amir-video-poster"
        alt="Amir Engineering facility and production machinery"
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={cn("object-cover object-top", className)}
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_VIDEO_POSTER}
        aria-hidden="true"
        className={cn("motion-reduce:hidden absolute inset-0 h-full w-full object-cover object-top", className)}
      >
        <source src="/video/hero-background.mp4" type="video/mp4" />
      </video>
    </>
  );
}
