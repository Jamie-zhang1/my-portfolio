"use client";

import { ArrowDown, ArrowUpRight, DoorOpen } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site-config";

type HeroNote = string;

export function LaunchHero() {
  const t = useTranslations("Home.hero");
  const stages = t.raw("stages") as string[];
  const notes = t.raw("notes") as HeroNote[];
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOpen(window.sessionStorage.getItem("jamie-workspace-open") === "1");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const openWorkspace = () => {
    if (!open) {
      setOpen(true);
      window.sessionStorage.setItem("jamie-workspace-open", "1");
    }
    window.setTimeout(() => {
      document.getElementById("workspace")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, reduceMotion ? 0 : 260);
  };

  return (
    <section className={`launch-hero ${open ? "is-ready" : "is-standby"}`}>
      <div className="site-shell launch-grid">
        <motion.div className="launch-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="launch-meta">
            <span>{t("labId")}</span>
            <span className="status-marker" data-state={open ? "ready" : "standby"}><i aria-hidden="true" />{open ? t("ready") : t("standby")}</span>
          </div>
          <p className="section-kicker">{t("kicker")}</p>
          <h1>{t("title")}</h1>
          <p className="launch-role">{t("role")}</p>
          <p className="launch-headline">{t("headline")}</p>
          <p className="launch-description">{t("description")}</p>
          <div className="launch-actions">
            <button className="button button-primary" type="button" onClick={openWorkspace}><DoorOpen size={16} aria-hidden="true" />{open ? t("workspaceOpen") : t("openWorkspace")}</button>
            <a className="button button-secondary" href="#work">{t("viewWork")}<ArrowDown size={16} aria-hidden="true" /></a>
            <a className="text-link" href={siteConfig.github} target="_blank" rel="noopener noreferrer">{t("github")}<ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <p className="launch-availability"><span aria-hidden="true" />{t("availability")}</p>
        </motion.div>

        <motion.div className="launch-visual workspace-visual" aria-label={t("visualLabel")} initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <div className="prototype-window-bar"><span>{t("visualLabel")}</span><span>{open ? t("ready") : t("standby")}</span></div>
          <div className="workspace-map">
            <div className="workspace-note-stack" aria-hidden="true">
              {notes.map((note, index) => <span key={note} style={{ "--note-index": index } as React.CSSProperties}>{note}</span>)}
            </div>
            <div className="flow-rail launch-flow-rail">
              {stages.map((stage, index) => <div className={open ? "is-active" : ""} key={stage}><span>{String(index + 1).padStart(2, "0")}</span><p>{stage}</p></div>)}
            </div>
            <div className="prototype-window hero-window-mini">
              <div className="prototype-window-bar"><span>Prototype Window</span><span>01</span></div>
              <div className="hero-window-body">
                <i aria-hidden="true" />
                <strong>Problem → Flow → Prototype</strong>
                <p>Clear decisions, visible states, editable output.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
