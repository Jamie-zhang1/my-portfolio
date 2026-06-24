import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Blocks, BrainCircuit, Code2, FileOutput, Layers3, Mic2, MousePointer2, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BuildStory } from "@/components/home/build-story";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroScene } from "@/components/home/hero-scene";
import { ProductLab } from "@/components/home/product-lab";
import { RotatingText } from "@/components/home/rotating-text";
import { MagneticLink } from "@/components/interaction/magnetic-link";
import { Reveal } from "@/components/interaction/reveal";
import { siteConfig } from "@/data/site-config";
import type { AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

const capabilityIcons = [BrainCircuit, Blocks, Mic2, FileOutput];
type Capability = { number: string; title: string; cn: string; description: string; signal: string };
type Proof = { value: string; label: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.home" });
  return {
    title: { absolute: t("title") }, description: t("description"), alternates: localizedAlternates(locale),
    openGraph: { type: "website", locale: locale === "zh" ? "zh_CN" : "en_US", url: `/${locale}`, title: t("title"), description: t("description"), images: [siteConfig.ogImage] },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const roles = t.raw("hero.roles") as string[];
  const proofs = t.raw("hero.proofs") as Proof[];
  const capabilities = t.raw("capabilities.items") as Capability[];

  return (
    <div className="portfolio-home">
      <section className="hero-section site-shell">
        <Reveal className="hero-copy">
          <div className="availability"><span className="live-dot" /> {t("hero.availability")} <i>{t("hero.year")}</i></div>
          <p className="hero-overline">{t("hero.overline")}</p>
          <h1>{t("hero.title1")}<br /><span>{t("hero.titleAccent")}</span><br />{t("hero.title3")}</h1>
          <div className="hero-role"><span>{t("hero.currently")}</span><RotatingText roles={roles} /></div>
          <p className="hero-description">{t("hero.description")}</p>
          <div className="hero-actions">
            <MagneticLink href="/#work" className="button button-primary">{t("hero.viewWork")} <ArrowDown size={16} /></MagneticLink>
            <MagneticLink href="/#lab" className="button button-ghost">{t("hero.tryDemo")} <Sparkles size={16} /></MagneticLink>
            <MagneticLink href={siteConfig.github} external className="text-link"><Code2 size={16} /> {t("hero.github")} <ArrowUpRight size={13} /></MagneticLink>
          </div>
          <div className="hero-proof">{proofs.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
        </Reveal>
        <HeroScene />
      </section>

      <section id="work" className="section-block site-shell">
        <div className="section-heading split-heading"><div><p className="section-kicker">{t("work.kicker")}</p><h2>{t("work.title1")}<br />{t("work.title2")}</h2></div><p>{t("work.description")}</p></div>
        <FeaturedProducts />
      </section>

      <section id="lab" className="lab-section"><div className="site-shell"><div className="section-heading split-heading light-heading"><div><p className="section-kicker">{t("lab.kicker")}</p><h2>{t("lab.title1")}<br />{t("lab.title2")}</h2></div><p>{t("lab.description")}</p></div><ProductLab /></div></section>

      <section id="process" className="process-section site-shell"><BuildStory /></section>

      <section className="capabilities-section site-shell">
        <div className="section-heading split-heading"><div><p className="section-kicker">{t("capabilities.kicker")}</p><h2>{t("capabilities.title1")}<br />{t("capabilities.title2")}</h2></div><p>{t("capabilities.description")}</p></div>
        <div className="capability-grid">{capabilities.map((item, index) => { const Icon = capabilityIcons[index]; return <article key={item.title} className="capability-card"><div><span>{item.number}</span><small>{item.signal}</small></div><Icon size={30} strokeWidth={1.35} /><p>{item.cn}</p><h3>{item.title}</h3><span>{item.description}</span><i><MousePointer2 size={14} /></i></article>; })}</div>
      </section>

      <section id="about" className="about-section site-shell">
        <div className="about-orbit"><span>{t("about.orbitLogic")}</span><span>{t("about.orbitProduct")}</span><span>{t("about.orbitAi")}</span><div><Layers3 size={32} /></div></div>
        <div className="about-copy"><p className="section-kicker">{t("about.kicker")}</p><h2>{t("about.title1")}<br />{t("about.title2")}<br />{t("about.title3")}</h2><p>{t("about.bio1")}</p><p>{t("about.bio2")}</p><div className="about-links"><a href={siteConfig.github} target="_blank" rel="noopener noreferrer">{t("about.github")} <ArrowUpRight size={14} /></a><a href={`mailto:${siteConfig.email}`}>{t("about.email")} <ArrowUpRight size={14} /></a><a href={siteConfig.resume} download>{t("about.resume")} <ArrowUpRight size={14} /></a></div></div>
      </section>
    </div>
  );
}
