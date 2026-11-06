import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  // Las fuentes del PDF del diagnóstico se leen del disco al generarlo.
  outputFileTracingIncludes: {
    "/api/chat/report": ["./lib/report/fonts/**"],
  },
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
