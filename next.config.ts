import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/decision-copilot/:path*",
        destination: "/projects/decision-copilot/:path*",
        permanent: false,
      },
      {
        source: "/proddoc-ai/:path*",
        destination: "/projects/proddoc-ai/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
