"use client";

import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, PenLine } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { NoteBuddy, type NoteBuddyState } from "@/components/mascot/note-buddy";
import { MotionButton } from "@/components/motion/motion-button";
import { MotionCard } from "@/components/motion/motion-card";
import { siteConfig } from "@/data/site-config";

type HeroNote = { type: string; title: string; description: string; step?: string };

function stateForType(type: string): NoteBuddyState {
  if (type === "draft" || type === "review") return "thinking";
  if (type === "learning") return "saved";
  return "hover";
}

export function LaunchHero() {
  const t = useTranslations("Home.hero");
  const stages = t.raw("stages") as string[];
  const notes = t.raw("notes") as HeroNote[];
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [buddyState, setBuddyState] = useState<NoteBuddyState>("idle");

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
        <motion.div className="launch-copy" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <p className="section-kicker">{t("kicker")}</p>
          <h1>{t("title")}</h1>
          <p className="launch-role">{t("role")}</p>
          <p className="launch-headline">{t("headline")}</p>
          <p className="launch-description">{t("description")}</p>
          <div className="launch-actions">
            <MotionButton className="button button-primary" href="/notes/idea/new" onClick={markOpen} onMouseEnter={() => setBuddyState("hover")} onMouseLeave={() => setBuddyState("idle")}>
              <PenLine size={16} aria-hidden="true" />{t("openWorkspace")}
            </MotionButton>
            <MotionButton className="button button-secondary" type="button" onClick={scrollToWork}>
              {t("viewWork")}<ArrowDown size={16} aria-hidden="true" />
            </MotionButton>
            <MotionButton className="text-link" href={siteConfig.github} target="_blank" rel="noopener noreferrer">
              {t("github")}<ArrowUpRight size={14} aria-hidden="true" />
            </MotionButton>
          </div>
          <p className="launch-availability"><span aria-hidden="true" />{t("availability")}</p>
        </motion.div>

        <motion.div className="launch-visual workspace-visual" aria-label={t("visualLabel")} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <div className="workspace-map workspace-map-with-buddy">
            <div className="workspace-buddy-row">
              <NoteBuddy state={buddyState} size="md" label="Note Buddy" />
              <div className="workspace-entry-copy">
                <strong>{t("visualTitle")}</strong>
                <p>{t("visualDescription")}</p>
              </div>
            </div>
            <div className="workspace-note-stack workspace-entry-stack">
              {notes.map((note, index) => (
                <MotionCard
                  className="workspace-note-entry"
                  href={`/notes/${note.type}/new`}
                  key={note.type}
                  style={{ "--note-index": index } as CSSProperties}
                  onClick={markOpen}
                  onMouseEnter={() => setBuddyState(stateForType(note.type))}
                  onMouseLeave={() => setBuddyState("idle")}
                >
                  <em className="workspace-note-step">{note.step}</em>
                  <span>{note.title}</span>
                  <small>{note.description}</small>
                  <ArrowRight size={14} aria-hidden="true" />
                </MotionCard>
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
