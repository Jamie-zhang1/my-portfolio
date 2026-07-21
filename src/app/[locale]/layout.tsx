import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ClientChromeShell } from "@/components/client-chrome-shell";
import { routing, type AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import "../globals.css";

export const revalidate = 0;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  if (!hasLocale(routing.locales, requestedLocale)) notFound();
  const locale = requestedLocale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Metadata.home" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s｜${siteConfig.name}` },
    description: t("description"),
    alternates: localizedAlternates(locale),
    authors: [{ name: siteConfig.author }],
    keywords: locale === "zh" ? ["AI 产品", "Agent 工作流", "Vibe Coding", "Next.js", "交互原型"] : ["AI products", "Agent workflows", "Vibe Coding", "Next.js", "interactive prototypes"],
    openGraph: {
      type: "website", locale: locale === "zh" ? "zh_CN" : "en_US", url: `/${locale}`,
      title: t("title"), description: t("description"), siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: [siteConfig.ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/sheep-mascot-main.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientChromeShell locale={locale} messages={messages}>
          {children}
        </ClientChromeShell>
      </body>
    </html>
  );
}
