import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The real, supplied Amir Engineering logo file (icon + wordmark + tagline).
 * Rendered unaltered via object-contain — never cropped or stretched. On dark
 * surfaces, use the white silhouette instead (see `BrandLogoWhite`).
 */
const SVGFilter = () => (
  <svg width="0" height="0" className="absolute">
    <filter id="black-to-white-filter" colorInterpolationFilters="sRGB">
      <feColorMatrix
        type="matrix"
        values="
          0  0  0  0  1
         -1  1  0  0  1
         -1  0  1  0  1
          0  0  0  1  0
        "
      />
    </filter>
  </svg>
);

export function BrandLogo({ className }: { className?: string }) {
  return (
    <>
      <SVGFilter />
      <Image
        src="/brand/logo.png"
        alt="Amir Engineering"
        width={500}
        height={200}
        priority
        className={cn("h-12 w-auto object-contain transition-all dark:[filter:url(#black-to-white-filter)]", className)}
      />
    </>
  );
}

export function BrandLogoDarkText({ className }: { className?: string }) {
  return (
    <>
      <SVGFilter />
      <Image
        src="/brand/logo.png"
        alt="Amir Engineering"
        width={500}
        height={200}
        priority
        className={cn("h-12 w-auto object-contain transition-all dark:[filter:url(#black-to-white-filter)]", className)}
      />
    </>
  );
}


/**
 * Brand mark: a monoline "A" (peak/roofline, doubling as an upward
 * production/growth cue) on a machined charcoal badge. Colors are fixed
 * hex, not theme tokens — a brand mark should read the same regardless of
 * light/dark mode. Pure geometry, no font dependency, so it also works
 * standalone as src/app/icon.svg (favicon).
 */
export function LogoMark({
  className,
  variant = "badge",
}: {
  className?: string;
  /** "badge": charcoal square + amber mark (default, light surfaces). "bare": amber mark only, for placing directly on an already-dark surface (e.g. the footer). */
  variant?: "badge" | "bare";
}) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={cn("size-8", className)} aria-hidden="true">
      {variant === "badge" && <rect width="100" height="100" rx="22" fill="#1B1E24" />}
      <path
        d="M26 78 L50 24 L74 78"
        stroke="#E8871E"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M38 58 H62" stroke="#E8871E" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, wordmarkClassName }: { className?: string; wordmarkClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("font-heading text-lg font-bold tracking-tight", wordmarkClassName)}>
        Amir Engineering
      </span>
    </span>
  );
}
