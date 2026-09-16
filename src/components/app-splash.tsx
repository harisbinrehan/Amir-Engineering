"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/icons/logo";

/**
 * Branded launch splash, shown only when running as an installed PWA
 * (standalone display mode). Chrome's own install splash is a plain
 * icon-on-background frame it builds from the manifest; this overlay adds a
 * brief animated moment on top of that once the app shell has hydrated,
 * then removes itself for good.
 */
export function AppSplash() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari's installed-app flag
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isStandalone || reducedMotion) return;

    setVisible(true);
    const fadeTimer = setTimeout(() => setFading(true), 550);
    const removeTimer = setTimeout(() => setVisible(false), 850);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1B1E24] transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <LogoMark className="size-16 animate-[splash-in_0.5s_ease-out]" />
    </div>
  );
}
