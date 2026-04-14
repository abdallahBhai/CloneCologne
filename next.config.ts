import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bobppxienkpuihgsjgcy.supabase.co",
      },
    ],
  },
};

export default nextConfig;
