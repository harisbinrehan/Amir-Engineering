import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — any project ref under the standard Supabase domain.
      { protocol: "https", hostname: "*.supabase.co" },
      // YouTube thumbnail frames for the "Engineering in Motion" video showcase.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
