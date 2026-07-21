"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/interaction/language-switcher";
import { MobileNav } from "@/components/interaction/mobile-nav";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const locale = useLocale();
  const navigation = locale === "zh"
    ? [
        { label: "作品", count: "[04]", href: "/#work" },
        { label: "能力", count: "[04]", href: "/#about" },
        { label: "经历", count: "[03]", href: "/#experience" },
        { label: "联系", href: "/#contact" },
      ]
    : [
        { label: "Work", count: "[04]", href: "/#work" },
        { label: "Capability", count: "[04]", href: "/#about" },
        { label: "Experience", count: "[03]", href: "/#experience" },
        { label: "Contact", href: "/#contact" },
      ];

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="header-availability" aria-label="Jamie Zhang portfolio home">
          <i aria-hidden="true" />{locale === "zh" ? "可参与新的项目" : "Available for New Project"}
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <Link key={`${item.href}-${item.label}`} href={item.href}><span>{item.label}</span>{item.count ? <small>{item.count}</small> : null}</Link>)}
        </nav>
        <div className="header-tools">
          <LanguageSwitcher compact />
          <a className="header-talk" href={`mailto:${siteConfig.email}`}>{locale === "zh" ? "聊聊项目" : "Let’s Talk"}<ArrowUpRight size={14} /></a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useTranslations("Footer");
  return <footer className="site-footer site-footer-minimal"><div className="site-shell footer-bottom"><div><span>JZ</span><p>{t("role")}</p></div><p>© {new Date().getFullYear()} {t("built")}</p></div></footer>;
}