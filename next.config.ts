import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["replicate.delivery", "pbxt.replicate.delivery"],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**", // Allow all HTTPS domains for now (for MVP)
    },
  ],
};

export default nextConfig;
