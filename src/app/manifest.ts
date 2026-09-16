import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    // Matches the real logo's own white background, so the native OS launch
    // splash (background_color + centered icon, built by the browser before
    // any of our code runs) has no visible seam around the icon square.
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
