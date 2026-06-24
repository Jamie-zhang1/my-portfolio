import { redirect } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";

export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  redirect(`/${locale}/projects/ai-decision-copilot`);
}
