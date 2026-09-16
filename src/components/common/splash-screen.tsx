"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrandLogoDarkText } from "@/components/icons/logo";

const subscribeNoop = () => () => {};

// Only show once per session to avoid annoying users on refresh. Read
// synchronously via useSyncExternalStore (server snapshot: true, so nothing
// flashes before hydration) instead of deciding in an effect.
function getHasSeenSplashSnapshot() {
  try {
    return sessionStorage.getItem("hasSeenSplash") === "true";
  } catch {
    return false;
  }
}

export function SplashScreen() {
  const hasSeenSplash = useSyncExternalStore(subscribeNoop, getHasSeenSplashSnapshot, () => true);
  const [dismissed, setDismissed] = useState(false);
  const show = !hasSeenSplash && !dismissed;

  useEffect(() => {
    if (hasSeenSplash) return;

    const timer = setTimeout(() => {
      setDismissed(true);
      try {
        sessionStorage.setItem("hasSeenSplash", "true");
      } catch {
        // Storage may be unavailable (private browsing) — splash just replays next load.
      }
    }, 2500); // Display for 2.5 seconds

    return () => clearTimeout(timer);
  }, [hasSeenSplash]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1, y: 0 }}
          exit={{ 
            opacity: 0, 
            y: "-100%", 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <BrandLogoDarkText className="h-12 sm:h-16 md:h-20" />
          </motion.div>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
            className="bg-industrial mt-8 h-0.5 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
