import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder imagery used until real product/machinery photography is provided.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Supabase Storage — any project ref under the standard Supabase domain.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
