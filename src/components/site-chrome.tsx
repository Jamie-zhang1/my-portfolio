"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/interaction/language-switcher";
import { MobileNav } from "@/components/interaction/mobile-nav";
import { SectionLink } from "@/components/interaction/section-link";
import { ThemeSwitcher } from "@/components/interaction/theme-switcher";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const locale = useLocale();
  const navigation = locale === "zh"
    ? [
        { label: "作品", count: "[04]", section: "work" },
        { label: "能力", count: "[04]", section: "about" },
        { label: "经历", count: "[03]", section: "experience" },
        { label: "联系", section: "contact" },
      ]
    : [
        { label: "Work", count: "[04]", section: "work" },
        { label: "Capability", count: "[04]", section: "about" },
        { label: "Experience", count: "[03]", section: "experience" },
        { label: "Contact", section: "contact" },
      ];

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="header-availability" aria-label="Jamie Zhang portfolio home">
          <i aria-hidden="true" />{locale === "zh" ? "可参与新的项目" : "Available for New Project"}
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <SectionLink key={`${item.section}-${item.label}`} section={item.section}><span>{item.label}</span>{item.count ? <small>{item.count}</small> : null}</SectionLink>)}
        </nav>
        <div className="header-tools">
          <ThemeSwitcher compact />
          <LanguageSwitcher compact />
          <a className="header-talk" href={siteConfig.gmailComposeUrl} target="_blank" rel="noopener noreferrer">{locale === "zh" ? "聊聊项目" : "Let’s Talk"}<ArrowUpRight size={14} /></a>
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
