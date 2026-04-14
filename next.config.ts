import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bobppxienkpuihgsjgcy.supabase.co",
      },
      {
        protocol: "https",
        hostname: "fimgs.net",
      },
      {
        protocol: "http",
        hostname: "armaf.com",
      },
      {
        protocol: "https",
        hostname: "armaf.com",
      },
      {
        protocol: "http",
        hostname: "hiddensamples.com",
      },
      {
        protocol: "https",
        hostname: "hiddensamples.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
