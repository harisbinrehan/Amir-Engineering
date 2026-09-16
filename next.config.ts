import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — any project ref under the standard Supabase domain.
      { protocol: "https", hostname: "*.supabase.co" },
      // Local Supabase Storage (supabase start) for dev previews.
      { protocol: "http", hostname: "127.0.0.1", port: "54321" },
      // YouTube thumbnail frames for the "Engineering in Motion" video showcase.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
