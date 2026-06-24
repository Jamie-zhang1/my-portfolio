"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Code2, FileText, FlaskConical, FolderKanban, Languages, Mail, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/data/site-config";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function CommandMenu() {
  const t = useTranslations("Command");
  const locale = useLocale() as AppLocale;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale: AppLocale = locale === "zh" ? "en" : "zh";
  const commands = useMemo(() => [
    { label: t("work"), detail: t("workDetail"), href: "/#work", icon: FolderKanban },
    { label: t("lab"), detail: t("labDetail"), href: "/#lab", icon: FlaskConical },
    { label: t("email"), detail: siteConfig.email ?? "", href: `mailto:${siteConfig.email}`, icon: Mail, external: true },
    { label: t("github"), detail: "Jamie-zhang1", href: siteConfig.github, icon: Code2, external: true },
    { label: t("resume"), detail: t("resumeDetail"), href: siteConfig.resume, icon: FileText, external: true },
    { label: nextLocale === "en" ? t("switchEnglish") : t("switchChinese"), detail: t("languageDetail"), href: pathname, icon: Languages, locale: nextLocale },
  ], [nextLocale, pathname, t]);
  const filtered = useMemo(
    () => commands.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (item: (typeof commands)[number]) => {
    setOpen(false);
    if (item.locale) {
      router.replace(pathname, { locale: item.locale, scroll: false });
    } else if (item.external) window.open(item.href, item.href.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer");
    else router.push(item.href);
  };

  return (
    <>
      <button className="command-trigger" onClick={() => setOpen(true)} aria-label={t("open")}>
        <Search size={14} aria-hidden="true" />
        <span>{t("navigate")}</span>
        <kbd>⌘K</kbd>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="command-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("dialog")}
              className="command-panel"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="command-search">
                <Search size={18} aria-hidden="true" />
                <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("placeholder")} />
                <button onClick={() => setOpen(false)} aria-label={t("open")}><X size={18} /></button>
              </div>
              <div className="command-list">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={`${item.href}-${item.locale ?? "route"}`} onClick={() => go(item)}>
                      <span className="command-icon"><Icon size={17} /></span>
                      <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
