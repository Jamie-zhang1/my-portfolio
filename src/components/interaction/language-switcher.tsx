"use client";

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

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    startTransition(() => router.replace(pathname, { locale: nextLocale, scroll: false }));
  };

  return (
    <div className={`language-switcher ${compact ? "is-compact" : ""}`} role="group" aria-label={t("groupLabel")} data-pending={pending || undefined}>
      <button type="button" onClick={() => switchLocale("zh")} aria-label={t("switchToZh")} aria-pressed={locale === "zh"} className={locale === "zh" ? "is-active" : ""}>{compact ? "ZH" : t("zh")}</button>
      <span aria-hidden="true">/</span>
      <button type="button" onClick={() => switchLocale("en")} aria-label={t("switchToEn")} aria-pressed={locale === "en"} className={locale === "en" ? "is-active" : ""}>{t("en")}</button>
    </div>
  );
}
