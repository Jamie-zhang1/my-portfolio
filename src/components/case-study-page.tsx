import { ArrowLeft, ArrowUpRight, Check, Code2, Play } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { LocalizedCaseStudy } from "@/data/case-studies-localized";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

const decisionScreens = [
  { src: "/screenshots/portfolio/copilot-demo-select.png", alt: "AI Decision Copilot input screen" },
  { src: "/screenshots/portfolio/copilot-demo-result.png", alt: "AI Decision Copilot result screen" },
];

function CaseSectionLabel({ number, label }: { number: string; label: string }) {
  return <div className="case-section-label"><span>{number}</span><p>{label}</p></div>;
}

export function CaseStudyPage({ study }: { study: LocalizedCaseStudy }) {
  const t = useTranslations("Case");
  const { project } = study;
  const heroImage = project.homepageImages[0]?.src ?? (study.slug === "ai-decision-copilot" ? "/screenshots/portfolio/copilot-desktop.png" : project.icon.src);
  const demoHref = study.slug === "heard-sheep" ? siteConfig.heardSheepLiveUrl : project.tryPath;
  const gallery = project.screenshots?.length ? project.screenshots.slice(0, study.slug === "heard-sheep" ? 5 : 4) : decisionScreens;

  return (
    <article className="case-study">
      <header className="case-header site-shell">
        <Link href="/#work" className="case-back"><ArrowLeft size={15} />{t("allWork")}</Link>
        <div className="case-header-grid">
          <div className="case-header-copy">
            <div className="case-header-status"><span>{project.number} / {study.eyebrow}</span><span className="status-marker" data-state={study.slug === "heard-sheep" ? "ready" : "standby"}><i aria-hidden="true" />{study.experienceTag}</span></div>
            <h1>{study.title}</h1>
            <p className="case-outcome">{study.outcome}</p>
            <dl className="case-header-meta">
              <div><dt>{t("role")}</dt><dd>{t("productDesign")}</dd></div>
              <div><dt>{t("status")}</dt><dd>{study.experienceTag}</dd></div>
            </dl>
            <div className="case-actions">
              {demoHref && (study.slug === "heard-sheep" ? (
                <a href={demoHref} target="_blank" rel="noopener noreferrer" className="button button-primary"><Play size={15} />{t("tryProduct")}</a>
              ) : (
                <Link href={demoHref} className="button button-primary"><Play size={15} />{t("tryProduct")}</Link>
              ))}
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="button button-secondary"><Code2 size={16} />{t("github")}</a>
            </div>
          </div>
          <div className="prototype-window case-hero-window">
            <div className="prototype-window-bar"><span>{study.eyebrow}</span><span>PRODUCT VIEW</span></div>
            <div className={`case-hero-image ${study.slug === "heard-sheep" ? "is-mobile-product" : ""}`}>
              <Image src={heroImage} alt={`${study.title} product interface`} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </header>

      <section className="case-section site-shell case-overview">
        <CaseSectionLabel number="01" label={t("overview")} />
        <div><h2>{study.outcome}</h2><p>{study.overview}</p><div className="case-chips">{study.homepageStack.map((item) => <span key={item}>{item}</span>)}</div></div>
      </section>

      <section className="case-section case-problem-solution">
        <div className="site-shell case-split">
          <article><CaseSectionLabel number="02" label={t("problem")} /><h2>{t("problem")}</h2><p>{study.problem}</p></article>
          <article><CaseSectionLabel number="03" label={t("solution")} /><h2>{t("solution")}</h2><p>{study.solution}</p></article>
        </div>
      </section>

      <section className="case-section site-shell case-role">
        <CaseSectionLabel number="04" label={t("myRole")} />
        <div className="case-task-list">
          {study.role.map((item, index) => <div className="task-sheet" key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><i className="status-marker-dot" aria-hidden="true" /></div>)}
        </div>
      </section>

      <section className="case-section case-flow-section">
        <div className="site-shell">
          <CaseSectionLabel number="05" label={t("coreFlow")} />
          <div className="case-flow-rail">
            {study.userFlow.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></div>)}
          </div>
        </div>
      </section>

      <section className="case-section site-shell case-interactions">
        <CaseSectionLabel number="06" label={t("keyInteraction")} />
        <div className="interaction-sheets">
          {study.keyInteractions.map((item, index) => <article className="task-sheet" key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
        </div>
      </section>

      <section className="case-section case-gallery-section">
        <div className="site-shell">
          <CaseSectionLabel number="UI" label={t("screens")} />
          <div className={`case-gallery ${study.slug === "heard-sheep" ? "is-mobile-gallery" : ""}`}>
            {gallery.map((shot, index) => (
              <figure className="prototype-window" key={shot.src}>
                <div className="prototype-window-bar"><span>SCREEN {String(index + 1).padStart(2, "0")}</span><span>{study.title}</span></div>
                <div className="case-gallery-image"><Image src={shot.src} alt={shot.alt} fill loading="lazy" sizes={study.slug === "heard-sheep" ? "(max-width: 700px) 70vw, 220px" : "(max-width: 900px) 100vw, 48vw"} /></div>
                <figcaption>{study.screenCaptions[index] ?? shot.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section site-shell case-ai">
        <CaseSectionLabel number="07" label={t("aiCapability")} />
        <div className="prototype-window ai-panel">
          <div className="prototype-window-bar"><span>AI CAPABILITY</span><span className="status-marker" data-state="ready"><i aria-hidden="true" />CONTROLLED</span></div>
          <p>{study.aiCapability}</p>
          <div className="ai-guardrails"><span>{t("structured")}</span><span>{t("human")}</span><span>{t("fallback")}</span></div>
        </div>
      </section>

      <section className="case-section case-tech">
        <div className="site-shell">
          <CaseSectionLabel number="08" label={t("techStack")} />
          <div className="tech-table">
            {study.techStack.map((group) => <div key={group.category}><span>{group.category}</span><p>{group.items.join(" / ")}</p></div>)}
          </div>
        </div>
      </section>

      <section className="case-section site-shell case-built">
        <CaseSectionLabel number="09" label={t("whatBuilt")} />
        <div className="built-grid">
          {study.whatIBuilt.map((item) => <p className="task-sheet" key={item}><Check size={15} /><span>{item}</span></p>)}
        </div>
      </section>

      <section className="case-section case-reflection">
        <div className="site-shell case-reflection-grid">
          <CaseSectionLabel number="10" label={t("reflection")} />
          <blockquote>{study.reflection}</blockquote>
        </div>
      </section>

      <section className="case-section site-shell case-final">
        <div><p className="section-kicker">11 / {t("demoGithub")}</p><h2>{t("finalTitle")}</h2></div>
        <div className="case-final-actions">
          {demoHref && (study.slug === "heard-sheep" ? <a href={demoHref} target="_blank" rel="noopener noreferrer" className="button button-primary">{t("openDemo")}<ArrowUpRight size={15} /></a> : <Link href={demoHref} className="button button-primary">{t("openDemo")}<ArrowUpRight size={15} /></Link>)}
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="button button-secondary">{t("viewGithub")}<Code2 size={15} /></a>
        </div>
      </section>
    </article>
  );
}