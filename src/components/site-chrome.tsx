"use client";

import { ArrowUpRight, Code2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { CommandMenu } from "@/components/interaction/command-menu";
import { LanguageSwitcher } from "@/components/interaction/language-switcher";
import { MobileNav } from "@/components/interaction/mobile-nav";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("Header");
  const navigation = [
    { label: t("work"), href: "/#work" },
    { label: t("demo"), href: "/#demo" },
    { label: t("method"), href: "/#method" },
    { label: t("about"), href: "/#about" },
  ];

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="brand-mark" aria-label="Jamie Product Lab home">
          <span>JPL</span>
          <span><strong>Jamie Product Lab</strong><small>{t("brandRole")}</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-tools">
          <a className="header-open-lab" href="#console">{t("openLab")}</a>
          <CommandMenu />
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
    <footer className="site-footer">
      <div className="site-shell footer-main">
        <div><p className="section-kicker">{t("kicker")}</p><h2>{t("title")}</h2></div>
        <div className="footer-actions">
          <a href={`mailto:${siteConfig.email}`} className="button button-primary"><Mail size={16} />{t("email")}</a>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="button button-secondary"><Code2 size={16} />{t("github")}</a>
          <a href={siteConfig.resume} download className="text-link">{t("resume")}<ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <div><span>JPL</span><p>Jamie Zhang<small>{t("role")}</small></p></div>
        <p>© {new Date().getFullYear()} {t("built")}</p>
      </div>
    </footer>
  );
}