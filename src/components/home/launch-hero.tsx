"use client";

import { ArrowDown, ArrowRight, ArrowUpRight, PenLine } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

type HeroNote = { type: string; title: string; description: string };

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

  const markOpen = () => {
    if (!open) {
      setOpen(true);
      window.sessionStorage.setItem("jamie-workspace-open", "1");
    }
  };

  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <section className={`launch-hero ${open ? "is-open" : ""}`}>
      <div className="site-shell launch-grid">
        <motion.div className="launch-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <p className="section-kicker">{t("kicker")}</p>
          <h1>{t("title")}</h1>
          <p className="launch-role">{t("role")}</p>
          <p className="launch-headline">{t("headline")}</p>
          <p className="launch-description">{t("description")}</p>
          <div className="launch-actions">
            <Link className="button button-primary" href="/notes/new?type=idea" onClick={markOpen}><PenLine size={16} aria-hidden="true" />{t("openWorkspace")}</Link>
            <button className="button button-secondary" type="button" onClick={scrollToWork}>{t("viewWork")}<ArrowDown size={16} aria-hidden="true" /></button>
            <a className="text-link" href={siteConfig.github} target="_blank" rel="noopener noreferrer">{t("github")}<ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <p className="launch-availability"><span aria-hidden="true" />{t("availability")}</p>
        </motion.div>

        <motion.div className="launch-visual workspace-visual" aria-label={t("visualLabel")} initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <div className="workspace-map">
            <div className="workspace-entry-copy">
              <strong>{t("visualTitle")}</strong>
              <p>{t("visualDescription")}</p>
            </div>
            <div className="workspace-note-stack workspace-entry-stack">
              {notes.map((note, index) => (
                <Link className="workspace-note-entry" href={`/notes/new?type=${note.type}`} key={note.type} style={{ "--note-index": index } as React.CSSProperties} onClick={markOpen}>
                  <span>{note.title}</span>
                  <small>{note.description}</small>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="flow-rail launch-flow-rail" aria-hidden="true">
              {stages.map((stage, index) => <div className={open ? "is-active" : ""} key={stage}><span>{String(index + 1).padStart(2, "0")}</span><p>{stage}</p></div>)}
            </div>
            <div className="hero-window-mini">
              <div className="hero-window-body">
                <i aria-hidden="true" />
                <strong>{t("previewTitle")}</strong>
                <p>{t("previewDescription")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}