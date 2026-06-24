import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export default async function TryPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Try.index" });
  const cards = [
    { href: "/try/proddoc-ai", title: "ProdDoc AI", label: t("proddoc"), image: "/project-icons/proddoc-ai.png" },
    { href: "/try/decision-copilot", title: "AI Decision Copilot", label: t("decision"), image: "/project-icons/decision-copilot.png" },
  ];
  return <div className="min-h-screen"><section className="site-shell page-pad"><Link href="/" className="case-back"><ArrowLeft size={15}/>{t("back")}</Link><div className="try-hero"><p className="section-kicker">{t("kicker")}</p><h1>{t("title")}</h1><p>{t("description")}</p></div><div className="try-grid">{cards.map((card)=><Link key={card.href} href={card.href} className="try-card"><div><Image src={card.image} alt="" width={120} height={120}/></div><p>{card.title}</p><h2>{card.label}</h2><span><ArrowUpRight size={16}/></span></Link>)}</div></section></div>;
}
