import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  transpilePackages: ["sanity", "next-sanity"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
