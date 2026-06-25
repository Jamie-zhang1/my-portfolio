import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
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
        destination: "/zh/projects/ai-decision-copilot/:path*",
        permanent: false,
      },
      {
        source: "/proddoc-ai/:path*",
        destination: "/zh/projects/proddoc-ai/:path*",
        permanent: false,
      },
      {
        source: "/projects/decision-copilot/:path*",
        destination: "/zh/projects/ai-decision-copilot/:path*",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
