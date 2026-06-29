import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MotionCard } from "@/components/motion/motion-card";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { getLocalizedCaseStudies } from "@/data/case-studies-localized";
import type { AppLocale } from "@/i18n/routing";

export async function WorksCanvas({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Home.work" });
  const studies = getLocalizedCaseStudies(locale);

  return (
    <StaggerList className="works-grid">
      {studies.map((study, index) => (
        <StaggerItem key={study.slug}>
          <MotionCard className="work-card" href={`/projects/${study.slug}`} aria-label={`${t("viewCase")}: ${study.title}`}>
            <article className="work-card-copy">
              <div className="work-card-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{study.subtitle}</span>
              </div>
              <p className="eyebrow-label">{study.eyebrow}</p>
              <h3>{study.title}</h3>
              <p className="work-positioning">{study.homepagePositioning}</p>
              <dl className="work-facts">
                <div><dt>{t("problem")}</dt><dd>{study.homepageProblem}</dd></div>
                <div><dt>{t("built")}</dt><dd>{study.homepageOutcome}</dd></div>
              </dl>
              <div className="work-stack" aria-label={t("stack")}>
                {study.homepageStack.map((item) => <span key={item}>{item}</span>)}
              </div>
              <span className="work-card-link">{t("viewCase")}<ArrowUpRight size={15} /></span>
            </article>
          </MotionCard>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
