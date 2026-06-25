import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BuildStory } from "@/components/home/build-story";
import { HeardSheepDemo } from "@/components/home/heard-sheep-demo";
import { LaunchHero } from "@/components/home/launch-hero";
import { WorksCanvas } from "@/components/home/works-canvas";
import { SectionHeader } from "@/components/section-header";
import { siteConfig } from "@/data/site-config";
import type { AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type AboutFocus = string;

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.home" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: localizedAlternates(locale),
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: `/${locale}`,
      title: t("title"),
      description: t("description"),
      images: [siteConfig.ogImage],
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const focus = t.raw("about.focus") as AboutFocus[];

  return (
    <div className="portfolio-home">
      <LaunchHero />

      <section id="demo" className="home-section demo-section site-shell">
        <SectionHeader
          kicker={t("demo.kicker")}
          title={t("demo.title")}
          description={t("demo.description")}
          aside={<span className="status-marker" data-state="standby"><i aria-hidden="true" />{t("demo.guided")}</span>}
        />
        <HeardSheepDemo />
      </section>

      <section id="work" className="home-section works-section site-shell">
        <SectionHeader kicker={t("work.kicker")} title={t("work.title")} description={t("work.description")} />
        <WorksCanvas locale={locale} />
      </section>

      <section id="method" className="home-section method-section site-shell">
        <BuildStory />
      </section>

      <section id="about" className="home-section about-section site-shell">
        <div className="about-copy">
          <p className="section-kicker">{t("about.kicker")}</p>
          <h2>{t("about.title1")}<br /><span>{t("about.title2")}</span></h2>
          <p>{t("about.bio1")}</p>
          <p>{t("about.bio2")}</p>
          <strong className="about-opportunity">{t("about.opportunity")}</strong>
          <div className="about-actions">
            <a className="button button-primary" href={`mailto:${siteConfig.email}`}>{t("about.email")}<ArrowUpRight size={15} /></a>
            <a className="button button-secondary" href={siteConfig.github} target="_blank" rel="noopener noreferrer">{t("about.github")}<ArrowUpRight size={15} /></a>
            <a className="text-link" href={siteConfig.resume} download>{t("about.resume")}<ArrowUpRight size={14} /></a>
          </div>
        </div>
        <div className="about-system prototype-window">
          <div className="prototype-window-bar"><span>{t("about.focusLabel")}</span><span>JAMIE / PROFILE</span></div>
          <div className="about-focus-list">
            {focus.map((item, index) => (
              <div className="task-sheet" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
                <i className="status-marker-dot" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}