"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Code2, Layers3, Target } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { getLocalizedCaseStudies } from "@/data/case-studies-localized";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function FeaturedProducts() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Home.work");
  const caseStudies = getLocalizedCaseStudies(locale);
  const [active, setActive] = useState<string>(caseStudies[0].slug);
  const reduceMotion = useReducedMotion();

  return (
    <div className="product-stack">
      {caseStudies.map((item) => {
        const expanded = active === item.slug;
        const preview = item.project.homepageImages[0]?.src ?? item.project.icon.src;
        const demoHref = item.slug === "heard-sheep" ? siteConfig.heardSheepLiveUrl : item.project.tryPath;
        return (
          <motion.article
            layout={!reduceMotion}
            key={item.slug}
            className={`product-card product-${item.accent} ${expanded ? "is-expanded" : ""}`}
            transition={{ layout: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
          >
            <button className="product-card-toggle" onClick={() => setActive(item.slug)} aria-expanded={expanded}>
              <span className="product-index">{item.project.number}</span>
              <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
              <span className="product-open">{expanded ? t("opened") : t("explore")}</span>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div className="product-expanded" initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <div className="product-copy">
                    <p className="section-kicker">{item.eyebrow}</p>
                    <h3>{item.outcome}</h3>
                    <p>{item.homepageSummary}</p>
                    <div className="product-facts">
                      <div><Target size={16} /><span><small>{t("problem")}</small>{item.problem}</span></div>
                      <div><Layers3 size={16} /><span><small>{t("role")}</small>{item.role.slice(0, 3).join(" · ")}</span></div>
                      <div><Code2 size={16} /><span><small>{t("stack")}</small>{item.project.tags.slice(0, 5).join(" · ")}</span></div>
                    </div>
                    <div className="product-actions">
                      <Link href={`/projects/${item.slug}`} className="button button-primary">{t("viewCase")} <ArrowUpRight size={16} /></Link>
                      {demoHref && (item.slug === "heard-sheep" ? <a href={demoHref} target="_blank" rel="noopener noreferrer" className="button button-ghost">{t("tryProduct")}</a> : <Link href={demoHref} className="button button-ghost">{t("tryProduct")}</Link>)}
                    </div>
                  </div>
                  <motion.div className="product-visual" layoutId={reduceMotion ? undefined : `product-${item.slug}`}>
                    <Image src={preview} alt={item.project.homepageImages[0]?.alt ?? item.project.icon.alt} fill sizes="(max-width: 900px) 100vw, 52vw" className={item.slug === "heard-sheep" ? "contain-preview" : "cover-preview"} />
                    <div className="visual-chip">{item.experienceTag}</div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}
