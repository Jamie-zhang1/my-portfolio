"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/interaction/language-switcher";
import { SectionLink } from "@/components/interaction/section-link";

export function MobileNav() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const items = [
    { label: `${t("work")} [04]`, section: "work" },
    { label: t("about"), section: "about" },
    { label: locale === "zh" ? "经历" : "Experience", section: "experience" },
    { label: t("contact"), section: "contact" },
  ];
  return (
    <div className="mobile-nav">
      <button className="mobile-menu-trigger" type="button" onClick={() => setOpen(true)} aria-label={t("menu")} aria-expanded={open}><Menu size={19} aria-hidden="true" /></button>
      {open && <div className="mobile-menu-backdrop" onMouseDown={() => setOpen(false)}><aside className="mobile-menu-panel" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()} aria-label={t("menu")}>
        <div className="mobile-menu-head"><span>JAMIE ZHANG</span><button type="button" onClick={() => setOpen(false)} aria-label={t("closeMenu")}><X size={19} /></button></div>
        <nav>{items.map((item, index) => <SectionLink section={item.section} key={item.section} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</SectionLink>)}</nav>
        <div className="mobile-preferences"><LanguageSwitcher /></div>
      </aside></div>}
    </div>
  );
}