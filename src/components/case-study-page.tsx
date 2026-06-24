import { ArrowLeft, ArrowUpRight, CheckCircle2, Code2, Layers3, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { LocalizedCaseStudy } from "@/data/case-studies-localized";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

export function CaseStudyPage({ study }: { study: LocalizedCaseStudy }) {
  const t = useTranslations("Case");
  const locale = useLocale();
  const { project } = study;
  const heroImage = project.homepageImages[0]?.src ?? project.screenshot ?? project.icon.src;
  const demoHref = study.slug === "heard-sheep" ? siteConfig.heardSheepLiveUrl : project.tryPath;

  return (
    <div className={`case-study case-${study.accent}`}>
      <section className="case-hero site-shell">
        <Link href="/#work" className="case-back"><ArrowLeft size={15} /> {t("allWork")}</Link>
        <div className="case-hero-grid">
          <div className="case-hero-copy">
            <p className="section-kicker">{project.number} / {study.eyebrow}</p>
            <h1>{study.title}</h1>
            <p className="case-outcome">{study.outcome}</p>
            <div className="case-hero-meta"><div><small>{t("role")}</small><span>{t("productDesign")}</span></div><div><small>{t("status")}</small><span>{study.experienceTag}</span></div></div>
            <div className="case-actions">
              {demoHref && (study.slug === "heard-sheep" ? <a href={demoHref} target="_blank" rel="noopener noreferrer" className="button button-primary"><Play size={15} /> {t("tryProduct")}</a> : <Link href={demoHref} className="button button-primary"><Play size={15} /> {t("tryProduct")}</Link>)}
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="button button-ghost"><Code2 size={16} /> {t("github")}</a>
            </div>
          </div>
          <div className="case-hero-visual"><Image src={heroImage} alt={`${study.title} product interface`} fill priority sizes="(max-width: 900px) 100vw, 48vw" className={study.slug === "heard-sheep" ? "contain-preview" : "cover-preview"} /><span>{study.subtitle}</span></div>
        </div>
      </section>

      <section className="case-overview site-shell case-section">
        <div className="case-section-title"><span>01</span><p>{t("overview")}</p></div>
        <div><h2>{t("overviewHeading")}</h2><p>{study.overview}</p><div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag === "多模态" && locale === "en" ? "Multimodal" : tag}</span>)}</div></div>
      </section>

      <section className="case-problem-solution case-section">
        <div className="site-shell case-two-column">
          <article><span>02 / {t("problem")}</span><h2>{t("problemHeading")}</h2><p>{study.problem}</p></article>
          <article><span>03 / {t("solution")}</span><h2>{t("solutionHeading")}</h2><p>{study.solution}</p></article>
        </div>
      </section>

      <section className="case-section site-shell case-role-section">
        <div className="case-section-title"><span>04</span><p>{t("myRole")}</p></div>
        <div><h2>{t("roleHeading")}</h2><div className="role-grid">{study.role.map((item, index) => <div key={item}><small>0{index + 1}</small><p>{item}</p></div>)}</div></div>
      </section>

      <section className="case-flow-section case-section">
        <div className="site-shell">
          <div className="case-section-title"><span>05</span><p>{t("coreFlow")}</p></div>
          <div className="flow-line">{study.userFlow.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p>{index < study.userFlow.length - 1 && <i />}</div>)}</div>
        </div>
      </section>

      <section className="case-section site-shell">
        <div className="case-section-title"><span>06</span><p>{t("keyInteraction")}</p></div>
        <div className="interaction-grid">{study.keyInteractions.map((item, index) => <article key={item.title}><div><Sparkles size={17} /><span>0{index + 1}</span></div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      </section>

      {project.screenshots?.length ? (
        <section className="case-gallery-section case-section">
          <div className="site-shell"><div className="case-section-title"><span>UI</span><p>{t("screens")}</p></div><div className={`case-gallery ${study.slug === "heard-sheep" ? "is-mobile-gallery" : ""}`}>{project.screenshots.slice(0, study.slug === "heard-sheep" ? 5 : 4).map((shot, index) => <figure key={shot.src}><div><Image src={shot.src} alt={`${study.title} screen ${index + 1}`} fill sizes={study.slug === "heard-sheep" ? "(max-width: 700px) 75vw, 240px" : "(max-width: 900px) 100vw, 48vw"} /></div><figcaption>{study.screenCaptions[index]}</figcaption></figure>)}</div></div>
        </section>
      ) : null}

      <section className="case-section site-shell case-ai-section">
        <div className="case-section-title"><span>07</span><p>{t("aiCapability")}</p></div>
        <div className="ai-capability-card"><div><Sparkles size={24} /><small>{t("aiLayer")}</small></div><h2>{t("aiHeading")}</h2><p>{study.aiCapability}</p><div><span>{t("structured")}</span><span>{t("human")}</span><span>{t("fallback")}</span></div></div>
      </section>

      <section className="case-section case-tech-section">
        <div className="site-shell">
          <div className="case-section-title"><span>08</span><p>{t("techStack")}</p></div>
          <div className="tech-groups">{study.techStack.map((group) => <div key={group.category}><small>{group.category}</small><p>{group.items.join(" · ")}</p></div>)}</div>
        </div>
      </section>

      <section className="case-section site-shell case-built-section">
        <div className="case-section-title"><span>09</span><p>{t("whatBuilt")}</p></div>
        <div><h2>{t("builtHeading")}</h2><div className="built-list">{study.whatIBuilt.map((item) => <p key={item}><CheckCircle2 size={17} /> {item}</p>)}</div></div>
      </section>

      <section className="case-section case-reflection-section">
        <div className="site-shell case-reflection"><div className="case-section-title"><span>10</span><p>{t("reflection")}</p></div><blockquote>{study.reflection}</blockquote></div>
      </section>

      <section className="case-section site-shell case-final">
        <div><Layers3 size={28} /><p className="section-kicker">11 / {t("demoGithub")}</p><h2>{t("finalHeading1")}<br />{t("finalHeading2")}</h2></div>
        <div className="case-final-actions">{demoHref && (study.slug === "heard-sheep" ? <a href={demoHref} target="_blank" rel="noopener noreferrer" className="button button-light">{t("openDemo")} <ArrowUpRight size={15} /></a> : <Link href={demoHref} className="button button-light">{t("openDemo")} <ArrowUpRight size={15} /></Link>)}<a href={project.github} target="_blank" rel="noopener noreferrer" className="button button-outline-light">{t("viewGithub")} <Code2 size={15} /></a></div>
      </section>
    </div>
  );
}
