import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hhzzwclcilysoncpspft.supabase.co",
        pathname: "/storage/v1/object/public/home-assets/**",
      },
    ],
  },
};

export default nextConfig;
