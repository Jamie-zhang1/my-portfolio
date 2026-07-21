"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Code2, FileText, FolderKanban, Languages, Mail, Monitor, Moon, Search, Sun, Workflow, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useTheme, type ThemeMode } from "@/components/interaction/theme-provider";
import { siteConfig } from "@/data/site-config";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type CommandItem = {
  label: string;
  detail: string;
  icon: typeof Search;
  href?: string;
  external?: boolean;
  locale?: AppLocale;
  theme?: ThemeMode;
};

export function CommandMenu() {
  const t = useTranslations("Command");
  const themeT = useTranslations("Theme");
  const locale = useLocale() as AppLocale;
  const { setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale: AppLocale = locale === "zh" ? "en" : "zh";
  const commands: CommandItem[] = useMemo(() => [
    { label: t("work"), detail: t("workDetail"), href: "/#work", icon: FolderKanban },
    { label: t("method"), detail: t("methodDetail"), href: "/#method", icon: Workflow },
    { label: t("about"), detail: t("aboutDetail"), href: "/#about", icon: FolderKanban },
    { label: t("contact"), detail: t("contactDetail"), href: "/#contact", icon: Mail },
    { label: themeT("set.light"), detail: t("themeDetail"), icon: Sun, theme: "light" },
    { label: themeT("set.dark"), detail: t("themeDetail"), icon: Moon, theme: "dark" },
    { label: themeT("set.system"), detail: t("themeDetail"), icon: Monitor, theme: "system" },
    { label: t("email"), detail: siteConfig.email ?? "", href: siteConfig.gmailComposeUrl, icon: Mail, external: true },
    { label: t("github"), detail: "Jamie-zhang1", href: siteConfig.github, icon: Code2, external: true },
    { label: t("resume"), detail: t("resumeDetail"), href: siteConfig.resume, icon: FileText, external: true },
    { label: nextLocale === "en" ? t("switchEnglish") : t("switchChinese"), detail: t("languageDetail"), href: pathname, icon: Languages, locale: nextLocale },
  ], [nextLocale, pathname, t, themeT]);
  const filtered = useMemo(() => commands.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase())), [commands, query]);

  useEffect(() => {
    const show = () => { setActiveIndex(0); setOpen(true); };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActiveIndex(0);
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", show);
    };
  }, []);

  const go = (item: CommandItem) => {
    setOpen(false);
    setQuery("");
    if (item.theme) setMode(item.theme);
    else if (item.locale) router.replace(pathname, { locale: item.locale, scroll: false });
    else if (item.external && item.href) window.open(item.href, "_blank", "noopener,noreferrer");
    else if (item.href) router.push(item.href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((value) => (value + 1) % filtered.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) => (value - 1 + filtered.length) % filtered.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(filtered[activeIndex]);
    }
  };

  return (
    <>
      <button className="command-trigger" onClick={() => { setActiveIndex(0); setOpen(true); }} aria-label={t("open")}><Search size={14} aria-hidden="true" /><span>{t("navigate")}</span><kbd>⌘K</kbd></button>
      <AnimatePresence>
        {open && (
          <motion.div className="command-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}>
            <motion.div role="dialog" aria-modal="true" aria-label={t("dialog")} className="command-panel" initial={{ opacity: 0, scale: 0.98, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -8 }} onMouseDown={(event) => event.stopPropagation()}>
              <div className="command-search">
                <Search size={18} aria-hidden="true" />
                <input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} onKeyDown={onInputKeyDown} placeholder={t("placeholder")} aria-controls="command-list" />
                <button onClick={() => setOpen(false)} aria-label={t("close")}><X size={18} /></button>
              </div>
              <div className="command-list" id="command-list" role="listbox">
                {filtered.map((item, index) => {
                  const Icon = item.icon;
                  return <button key={`${item.label}-${item.href ?? item.theme ?? item.locale ?? "route"}`} onClick={() => go(item)} onMouseEnter={() => setActiveIndex(index)} className={index === activeIndex ? "is-active" : ""} role="option" aria-selected={index === activeIndex}><span className="command-icon"><Icon size={17} /></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><ArrowUpRight size={15} aria-hidden="true" /></button>;
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
