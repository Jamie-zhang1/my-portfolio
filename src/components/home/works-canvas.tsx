import { getTranslations } from "next-intl/server";
import { ProjectCarousel } from "@/components/home/project-carousel";
import { getLocalizedCaseStudies } from "@/data/case-studies-localized";
import type { AppLocale } from "@/i18n/routing";

export async function WorksCanvas({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Home.work" });
  const studies = getLocalizedCaseStudies(locale);

  return (
    <ProjectCarousel
      items={studies.map((study) => ({
        slug: study.slug,
        title: study.title,
        subtitle: study.subtitle,
        eyebrow: study.eyebrow,
        positioning: study.homepagePositioning,
        problem: study.homepageProblem,
        outcome: study.homepageOutcome,
        capabilities: study.homepageCapabilities,
      }))}
      labels={{
        problem: t("problem"),
        built: t("built"),
        viewCase: t("viewCase"),
        previous: t("previous"),
        next: t("next"),
        progress: t("progress"),
      }}
    />
  );
}
