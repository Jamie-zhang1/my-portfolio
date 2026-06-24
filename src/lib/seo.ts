import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";

export function localizedAlternates(locale: AppLocale, pathname = ""): Metadata["alternates"] {
  return {
    canonical: `/${locale}${pathname}`,
    languages: {
      "zh-CN": `/zh${pathname}`,
      en: `/en${pathname}`,
      "x-default": `/zh${pathname}`,
    },
  };
}
