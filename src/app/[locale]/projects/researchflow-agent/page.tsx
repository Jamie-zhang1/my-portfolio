import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CaseStudyPage } from "@/components/case-study-page";
import { getLocalizedCaseStudy } from "@/data/case-studies-localized";
import type { AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

const slug = "researchflow-agent";

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `Metadata.projects.${slug}` });
  const path = `/projects/${slug}`;
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates(locale, path),
    openGraph: {
      type: "article",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: `/${locale}${path}`,
      title: t("title"),
      description: t("description"),
      images: ["/project-icons/proddoc-ai.png"],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CaseStudyPage study={getLocalizedCaseStudy(locale, slug)!} locale={locale} />;
}
