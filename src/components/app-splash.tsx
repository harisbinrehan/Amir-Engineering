"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { LogoMark } from "@/components/icons/logo";

const subscribeNoop = () => () => {};

function getStandaloneSnapshot() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's installed-app flag
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Branded launch splash, shown only when running as an installed PWA
 * (standalone display mode). Chrome's own install splash is a plain
 * icon-on-background frame it builds from the manifest; this overlay adds a
 * brief animated moment on top of that once the app shell has hydrated,
 * then removes itself for good.
 */
export function AppSplash() {
  const isStandalone = useSyncExternalStore(subscribeNoop, getStandaloneSnapshot, () => false);
  const reducedMotion = useSyncExternalStore(subscribeNoop, getReducedMotionSnapshot, () => false);
  const shouldShow = isStandalone && !reducedMotion;

  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;

    const fadeTimer = setTimeout(() => setFading(true), 550);
    const removeTimer = setTimeout(() => setDismissed(true), 850);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [shouldShow]);

  if (!shouldShow || dismissed) return null;

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
