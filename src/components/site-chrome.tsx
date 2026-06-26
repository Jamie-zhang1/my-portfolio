"use client";

import { Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CommandMenu } from "@/components/interaction/command-menu";
import { LanguageSwitcher } from "@/components/interaction/language-switcher";
import { MobileNav } from "@/components/interaction/mobile-nav";
import { ThemeSwitcher } from "@/components/interaction/theme-switcher";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("Header");
  const navigation = [
    { label: t("work"), href: "/#work" },
    { label: t("method"), href: "/#method" },
    { label: t("about"), href: "/#about" },
    { label: t("contact"), href: "/#contact" },
  ];

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="brand-mark" aria-label="Jamie Zhang portfolio home">
          <span>JZ</span>
          <span><strong>Jamie Zhang</strong><small>{t("brandRole")}</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-tools">
          <CommandMenu />
          <ThemeSwitcher compact />
          <LanguageSwitcher compact />
          <a className="header-github" href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label={t("githubLabel")}><Code2 size={16} /></a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="site-footer site-footer-minimal">
      <div className="site-shell footer-bottom">
        <div><span>JZ</span><p>{t("role")}</p></div>
        <p>© {new Date().getFullYear()} {t("built")}</p>
      </div>
    </footer>
  );
}