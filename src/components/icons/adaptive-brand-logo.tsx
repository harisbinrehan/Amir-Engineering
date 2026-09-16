"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { BrandLogo, BrandLogoPlate } from "@/components/icons/logo";

const subscribeNoop = () => () => {};

/**
 * BrandLogo for surfaces that switch between light and dark (header, mobile
 * nav) — the source logo file has no reversed version, so on dark it falls
 * back to BrandLogoPlate (white plate) instead of disappearing into the bg.
 */
export function AdaptiveBrandLogo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";

  if (isDark) return <BrandLogoPlate logoClassName={className} />;
  return <BrandLogo className={className} />;
}
