import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getLocalizedCaseStudies } from "@/data/case-studies-localized";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const decisionPreview = "/screenshots/portfolio/copilot-desktop.png";

export async function WorksCanvas({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Home.work" });
  const studies = getLocalizedCaseStudies(locale);

  return (
    <div className="works-grid">
      {studies.map((study, index) => {
        const isFeatured = index === 0;
        const preview = study.project.homepageImages[0]?.src ?? (study.slug === "ai-decision-copilot" ? decisionPreview : study.project.icon.src);
        const previewAlt = study.project.homepageImages[0]?.alt ?? `${study.title} product interface`;
        const demoHref = study.slug === "heard-sheep" ? siteConfig.heardSheepLiveUrl : study.project.tryPath;
        return (
          <article className={`work-card ${isFeatured ? "is-featured" : ""}`} key={study.slug}>
            <div className="work-card-copy">
              <div className="work-card-heading">
                <span>{study.project.number}</span>
                <span className="status-marker" data-state={study.slug === "heard-sheep" ? "ready" : "standby"}>
                  <i aria-hidden="true" />{study.slug === "heard-sheep" ? t("live") : t("prototype")}
                </span>
              </div>
              <p className="console-label">{study.eyebrow}</p>
              <h3>{study.title}</h3>
              <p className="work-positioning">{study.homepagePositioning}</p>
              <dl className="work-facts">
                <div><dt>{t("problem")}</dt><dd>{study.homepageProblem}</dd></div>
                <div><dt>{t("outcome")}</dt><dd>{study.homepageOutcome}</dd></div>
              </dl>
              <div className="work-stack" aria-label={t("stack")}>
                {study.homepageStack.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="work-actions">
                <Link href={`/projects/${study.slug}`} className="button button-secondary">{t("viewCase")}</Link>
                {demoHref && (study.slug === "heard-sheep" ? (
                  <a href={demoHref} className="button button-primary" target="_blank" rel="noopener noreferrer">{t("openProduct")}<ArrowUpRight size={15} /></a>
                ) : (
                  <Link href={demoHref} className="button button-primary">{t("tryProduct")}<ArrowUpRight size={15} /></Link>
                ))}
              </div>
            </div>
            <div className="prototype-window work-preview">
              <div className="prototype-window-bar"><span>{study.title}</span><span>PRODUCT VIEW / 0{index + 1}</span></div>
              <div className={`work-image ${study.slug === "heard-sheep" ? "is-mobile-product" : ""}`}>
                <Image
                  src={preview}
                  alt={previewAlt}
                  fill
                  priority={index === 0}
                  sizes={isFeatured ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 100vw, 42vw"}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}