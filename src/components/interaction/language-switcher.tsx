"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Language");
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? {} : { whileHover: { y: -1 }, whileTap: { scale: 0.96 }, transition: { duration: 0.14, ease: [0.22, 1, 0.36, 1] as const } };

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    startTransition(() => router.replace(pathname, { locale: nextLocale, scroll: false }));
  };

  return (
    <div className={`language-switcher ${compact ? "is-compact" : ""}`} role="group" aria-label={t("groupLabel")} data-pending={pending || undefined}>
      <motion.button type="button" onClick={() => switchLocale("zh")} aria-label={t("switchToZh")} aria-pressed={locale === "zh"} className={locale === "zh" ? "is-active" : ""} {...motionProps}>{compact ? "ZH" : t("zh")}</motion.button>
      <span aria-hidden="true">/</span>
      <motion.button type="button" onClick={() => switchLocale("en")} aria-label={t("switchToEn")} aria-pressed={locale === "en"} className={locale === "en" ? "is-active" : ""} {...motionProps}>{t("en")}</motion.button>
    </div>
  );
}

