"use client";

import { ArrowDown, ArrowUpRight, FlaskConical } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ProductConsole } from "@/components/home/product-console";
import { siteConfig } from "@/data/site-config";

export function LaunchHero() {
  const t = useTranslations("Home.hero");
  const stages = t.raw("stages") as string[];
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(window.sessionStorage.getItem("jamie-lab-open") === "1");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const openLab = () => {
    if (!ready) {
      setReady(true);
      window.sessionStorage.setItem("jamie-lab-open", "1");
    }
    window.setTimeout(() => {
      document.getElementById("console")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, reduceMotion ? 0 : 380);
  };

  return (
    <>
      <section className={`launch-hero ${ready ? "is-ready" : "is-standby"}`}>
        <div className="site-shell launch-grid">
          <motion.div className="launch-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <div className="launch-meta">
              <span>{t("labId")}</span>
              <span className="status-marker" data-state={ready ? "ready" : "standby"}><i aria-hidden="true" />{ready ? t("ready") : t("standby")}</span>
            </div>
            <p className="section-kicker">{t("kicker")}</p>
            <h1>{t("title")}</h1>
            <p className="launch-headline">{t("headline")}</p>
            <p className="launch-description">{t("description")}</p>
            <div className="launch-actions">
              <button className="button button-primary" type="button" onClick={openLab}><FlaskConical size={16} aria-hidden="true" />{ready ? t("labOpen") : t("openLab")}</button>
              <a className="button button-secondary" href="#work">{t("viewWork")}<ArrowDown size={16} aria-hidden="true" /></a>
              <a className="text-link" href={siteConfig.github} target="_blank" rel="noopener noreferrer">{t("github")}<ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <p className="launch-availability"><span aria-hidden="true" />{t("availability")}</p>
          </motion.div>
          <div className="launch-visual" aria-label={t("railLabel")}>
            <div className="prototype-window-bar"><span>{t("railLabel")}</span><span>{ready ? t("ready") : t("standby")}</span></div>
            <div className="signal-stage">
              <div className="signal-line" aria-hidden="true">{Array.from({ length: 36 }, (_, index) => <i key={index} style={{ "--signal-index": index } as React.CSSProperties} />)}</div>
              <div className="flow-rail launch-flow-rail">
                {stages.map((stage, index) => <div className={ready ? "is-active" : ""} key={stage}><span>{String(index + 1).padStart(2, "0")}</span><p>{stage}</p></div>)}
              </div>
              <div className="lab-signature" aria-hidden="true"><span>HS</span><div /><small>VOICE / FLOW / TASK</small></div>
            </div>
          </div>
        </div>
      </section>
      <ProductConsole ready={ready} />
    </>
  );
}