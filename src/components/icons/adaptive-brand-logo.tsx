"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { BrandLogo, BrandLogoWhite } from "@/components/icons/logo";

const subscribeNoop = () => () => {};

/**
 * BrandLogo for surfaces that switch between light and dark (header, mobile
 * nav, admin login) — swaps to the white silhouette in dark mode instead of
 * the full-color logo disappearing into the dark background.
 */
export function AdaptiveBrandLogo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={isDark ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : ""}>
      <BrandLogo className={className} />
    </div>
  );
}
