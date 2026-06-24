import { ArrowUpRight, Code2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { CommandMenu } from "@/components/interaction/command-menu";
import { LanguageSwitcher } from "@/components/interaction/language-switcher";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("Header");
  const navigation = [
    { label: t("work"), href: "/#work" },
    { label: t("lab"), href: "/#lab" },
    { label: t("process"), href: "/#process" },
    { label: t("about"), href: "/#about" },
  ];
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="brand-mark" aria-label="Jamie Zhang home">
          <span>JZ</span><strong>Jamie Zhang</strong><small>{t("brandRole")}</small>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-tools">
          <CommandMenu />
          <LanguageSwitcher compact />
          <a className="header-github" href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label={t("githubLabel")}><Code2 size={17} /></a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-callout">
          <div><p className="section-kicker">{t("kicker")}</p><h2>{t("title1")}<br />{t("title2")}</h2></div>
          <div className="footer-actions">
            <a href={`mailto:${siteConfig.email}`} className="button button-light"><Mail size={16} /> {t("email")}</a>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="button button-outline-light"><Code2 size={16} /> {t("github")}</a>
            <a href={siteConfig.resume} download className="footer-resume">{t("resume")} <ArrowUpRight size={14} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <div><span className="brand-monogram">JZ</span><p>Jamie Zhang<br /><small>{t("role")}</small></p></div>
          <p>© {new Date().getFullYear()} {t("built")}</p>
        </div>
      </div>
    </footer>
  );
}
