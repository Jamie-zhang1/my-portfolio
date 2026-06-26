import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BuildStory } from "@/components/home/build-story";
import { LaunchHero } from "@/components/home/launch-hero";
import { WorksCanvas } from "@/components/home/works-canvas";
import { SectionHeader } from "@/components/section-header";
import { siteConfig } from "@/data/site-config";
import type { AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type AboutFocus = string;
type RecentItem = { date: string; title: string; note: string; slug?: string };

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
  const recent = t.raw("recent.items") as RecentItem[];

  return (
    <div className="portfolio-home">
      <LaunchHero />
      <section id="work" className="home-section works-section site-shell">
        <SectionHeader kicker={t("work.kicker")} title={t("work.title")} description={t("work.description")} />
        <WorksCanvas locale={locale} />
      </section>


      <section id="recent" className="home-section recent-section site-shell">
        <SectionHeader kicker={t("recent.kicker")} title={t("recent.title")} description={t("recent.description")} />
        <div className="recent-list">
          {recent.map((item) => {
            const content = (
              <>
                <span>{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </>
            );

            return item.slug ? (
              <a className="recent-row" href={`/${locale}/projects/${item.slug}`} key={`${item.date}-${item.title}`}>
                {content}
              </a>
            ) : (
              <article className="recent-row" key={`${item.date}-${item.title}`}>
                {content}
              </article>
            );
          })}
        </div>
      </section>
      <section id="method" className="home-section method-section site-shell">
        <BuildStory />
      </section>

      <section id="about" className="home-section about-section site-shell">
        <div className="about-copy">
          <p className="section-kicker">{t("about.kicker")}</p>
          <h2 className="about-title"><span>{t("about.title1")}</span><span>{t("about.title2")}</span></h2>
          <p>{t("about.bio1")}</p>
          <p>{t("about.bio2")}</p>
          <strong className="about-opportunity">{t("about.opportunity")}</strong>
          <div className="about-actions">
            <a className="button button-primary" href={`mailto:${siteConfig.email}`}>{t("about.email")}<ArrowUpRight size={15} /></a>
            <a className="button button-secondary" href={siteConfig.github} target="_blank" rel="noopener noreferrer">{t("about.github")}<ArrowUpRight size={15} /></a>
            <a className="text-link" href={siteConfig.resume} download>{t("about.resume")}<ArrowUpRight size={14} /></a>
          </div>
        </div>
        <div className="about-system">
          <p className="section-kicker about-focus-kicker">{t("about.focusLabel")}</p>
          <div className="about-focus-list">
            {focus.map((item, index) => (
              <div className="task-sheet" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="home-section contact-section site-shell">
        <div>
          <p className="section-kicker">{t("contact.kicker")}</p>
          <h2>{t("contact.title")}</h2>
          <p>{t("contact.description")}</p>
        </div>
        <div className="contact-actions">
          <a className="button button-primary" href={`mailto:${siteConfig.email}`}>{t("contact.email")}<ArrowUpRight size={15} /></a>
          <a className="button button-secondary" href={siteConfig.github} target="_blank" rel="noopener noreferrer">{t("contact.github")}<ArrowUpRight size={15} /></a>
          <a className="text-link" href={siteConfig.resume} download>{t("contact.resume")}<ArrowUpRight size={14} /></a>
        </div>
      </section>
    </div>
  );
}
