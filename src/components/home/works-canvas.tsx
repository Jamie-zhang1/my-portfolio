import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getLocalizedCaseStudies } from "@/data/case-studies-localized";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function WorksCanvas({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Home.work" });
  const studies = getLocalizedCaseStudies(locale);

  return (
    <div className="works-grid">
      {studies.map((study, index) => (
        <article className="work-card" key={study.slug}>
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
              <div><dt>{t("built")}</dt><dd>{study.homepageOutcome}</dd></div>
            </dl>
            <div className="work-stack" aria-label={t("stack")}>
              {study.homepageStack.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="work-actions">
              <Link href={`/projects/${study.slug}`} className="button button-secondary">{t("viewCase")}<ArrowUpRight size={15} /></Link>
            </div>
          </div>
          <div className="work-card-rail" aria-hidden="true">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i />
            <p>{study.subtitle}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
