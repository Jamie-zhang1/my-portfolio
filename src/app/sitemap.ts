import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

const paths = [
  { pathname: "", priority: 1 },
  { pathname: "/projects/heard-sheep", priority: 0.9 },
  { pathname: "/projects/proddoc-ai", priority: 0.8 },
  { pathname: "/projects/ai-decision-copilot", priority: 0.8 },
  { pathname: "/notes", priority: 0.7 },
  { pathname: "/notes/new", priority: 0.7 },
  { pathname: "/try", priority: 0.7 },
  { pathname: "/try/proddoc-ai", priority: 0.6 },
  { pathname: "/try/decision-copilot", priority: 0.6 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap(({ pathname, priority }) => {
    const alternates = {
      languages: {
        "zh-CN": `${siteConfig.url}/zh${pathname}`,
        en: `${siteConfig.url}/en${pathname}`,
        "x-default": `${siteConfig.url}/zh${pathname}`,
      },
    };
    return (["zh", "en"] as const).map((locale) => ({
      url: `${siteConfig.url}/${locale}${pathname}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates,
    }));
  });
}
