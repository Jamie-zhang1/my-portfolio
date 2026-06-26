import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewLocalNote } from "@/components/notes/local-notes";
import type { AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Notes.meta" });
  return { title: t("newTitle"), alternates: localizedAlternates(locale, "/notes/new") };
}

export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Notes" });
  const copy = {
    common: t.raw("common") as Record<string, string>,
    new: t.raw("new") as Record<string, string>,
    types: t.raw("types") as { value: string; label: string }[],
    projects: t.raw("projects") as { value: string; label: string }[],
  };

  return (
    <Suspense fallback={null}>
      <NewLocalNote locale={locale} copy={copy} />
    </Suspense>
  );
}