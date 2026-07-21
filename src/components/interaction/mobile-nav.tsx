"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/interaction/language-switcher";
import { Link } from "@/i18n/navigation";

export function MobileNav() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const items = [
    { label: `${t("work")} [04]`, href: "/#work" },
    { label: t("about"), href: "/#about" },
    { label: t("contact"), href: "/#contact" },
  ];
  return (
    <div className="mobile-nav">
      <button className="mobile-menu-trigger" type="button" onClick={() => setOpen(true)} aria-label={t("menu")} aria-expanded={open}><Menu size={19} aria-hidden="true" /></button>
      {open && <div className="mobile-menu-backdrop" onMouseDown={() => setOpen(false)}><aside className="mobile-menu-panel" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()} aria-label={t("menu")}>
        <div className="mobile-menu-head"><span>JAMIE ZHANG</span><button type="button" onClick={() => setOpen(false)} aria-label={t("closeMenu")}><X size={19} /></button></div>
        <nav>{items.map((item, index) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link>)}</nav>
        <div className="mobile-preferences"><LanguageSwitcher /></div>
      </aside></div>}
    </div>
  );
}