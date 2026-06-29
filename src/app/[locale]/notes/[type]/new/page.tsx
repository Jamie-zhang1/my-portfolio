import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewLocalNote } from "@/components/notes/local-notes";
import type { AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type NoteType = "idea" | "draft" | "review" | "learning";

const noteTypes: NoteType[] = ["idea", "draft", "review", "learning"];

function normalizeType(value: string): NoteType {
  return noteTypes.includes(value as NoteType) ? (value as NoteType) : "idea";
}

export function generateStaticParams() {
  return noteTypes.map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;
  const normalizedType = normalizeType(type);
  const t = await getTranslations({ locale, namespace: "Notes" });
  const modes = t.raw("modes") as Record<NoteType, { heading: string; description: string }>;
  return { title: modes[normalizedType].heading, description: modes[normalizedType].description, alternates: localizedAlternates(locale, `/notes/${normalizedType}/new`) };
}

export default async function Page({ params }: { params: Promise<{ locale: AppLocale; type: string }> }) {
  const { locale, type } = await params;
  const normalizedType = normalizeType(type);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Notes" });
  const copy = {
    common: t.raw("common") as Record<string, string>,
    new: t.raw("new") as Record<string, string>,
    center: t.raw("center") as never,
    modes: t.raw("modes") as never,
    types: t.raw("types") as { value: string; label: string }[],
    projects: t.raw("projects") as { value: string; label: string }[],
  };

  return (
    <Suspense fallback={null}>
      <NewLocalNote locale={locale} copy={copy} initialType={normalizedType} />
    </Suspense>
  );
}