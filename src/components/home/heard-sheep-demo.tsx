"use client";

import { ArrowUpRight, Check, Mic, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

type DemoState = "idle" | "recording" | "transcript" | "analyzing" | "tasks";
type DemoTask = { title: string; meta: string };

export function HeardSheepDemo() {
  const t = useTranslations("Home.demo");
  const reduceMotion = useReducedMotion();
  const steps = t.raw("steps") as string[];
  const analysisLines = t.raw("analysisLines") as string[];
  const tasks = t.raw("tasks") as DemoTask[];
  const [state, setState] = useState<DemoState>("idle");

  useEffect(() => {
    if (state !== "recording" && state !== "analyzing") return;
    const timer = window.setTimeout(
      () => setState(state === "recording" ? "transcript" : "tasks"),
      reduceMotion ? 80 : state === "recording" ? 1200 : 1350,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, state]);

  const stepIndex = useMemo(() => {
    if (state === "transcript") return 1;
    if (state === "analyzing") return 2;
    if (state === "tasks") return 3;
    return 0;
  }, [state]);

  const status = state === "idle"
    ? t("idleStatus")
    : state === "recording"
      ? t("recordingStatus")
      : state === "transcript"
        ? t("transcriptStatus")
        : state === "analyzing"
          ? t("analyzingStatus")
          : t("readyStatus");

  return (
    <div className="heard-demo prototype-window">
      <div className="prototype-window-bar heard-demo-bar">
        <span>HEARD SHEEP / LIVE WORKFLOW</span>
        <span className="status-marker" data-state={state === "tasks" ? "ready" : state === "idle" ? "idle" : "processing"}>
          <i aria-hidden="true" />{status}
        </span>
      </div>

      <div className="demo-stepper" aria-label="Heard Sheep page steps">
        {steps.map((step, index) => (
          <div className={`${index === stepIndex ? "is-active" : ""} ${index < stepIndex ? "is-complete" : ""}`} key={step}>
            <span>{index < stepIndex ? <Check size={13} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>

      <div className="heard-demo-body">
        <div className="record-panel">
          <p className="eyebrow-label">VOICE INPUT</p>
          <button
            type="button"
            className={`record-button ${state === "recording" ? "is-recording" : ""}`}
            onClick={() => setState("recording")}
            disabled={state === "recording" || state === "analyzing"}
            aria-label={t("simulate")}
          >
            <Mic size={24} aria-hidden="true" />
          </button>
          <strong>{state === "recording" ? t("timerRecording") : t("timerIdle")}</strong>
          <span>{status}</span>
          {state === "idle" && <button className="button button-primary demo-primary-action" type="button" onClick={() => setState("recording")}>{t("simulate")}</button>}
          {state !== "idle" && state !== "recording" && (
            <button className="text-button" type="button" onClick={() => setState("idle")}><RotateCcw size={14} />{t("reset")}</button>
          )}
        </div>

        <div className="demo-output" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {(state === "idle" || state === "recording") && (
              <motion.div className="demo-wave-view" key="signal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={`waveform-line demo-wave ${state === "recording" ? "is-running" : ""}`} aria-hidden="true">
                  {Array.from({ length: 44 }, (_, index) => <i key={index} style={{ "--wave-index": index } as React.CSSProperties} />)}
                </div>
                <p>{t("guided")}</p>
              </motion.div>
            )}

            {state === "transcript" && (
              <motion.div className="transcript-sheet task-sheet" key="transcript" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="eyebrow-label">{t("transcriptLabel")}</p>
                <blockquote>{t("transcript")}</blockquote>
                <button className="button button-primary" type="button" onClick={() => setState("analyzing")}>{t("confirm")}</button>
              </motion.div>
            )}

            {state === "analyzing" && (
              <motion.div className="analysis-view" key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="eyebrow-label">{t("analysisLabel")}</p>
                <div className="analysis-rail">
                  {analysisLines.map((line, index) => (
                    <div key={line} style={{ "--analysis-index": index } as React.CSSProperties}>
                      <span>{String(index + 1).padStart(2, "0")}</span><p>{line}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {state === "tasks" && (
              <motion.div className="task-result" key="tasks" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="task-result-heading">
                  <div><p className="eyebrow-label">{t("tasksLabel")}</p><strong>{t("readyStatus")}</strong></div>
                  <span className="status-marker" data-state="review"><i aria-hidden="true" />REVIEW</span>
                </div>
                <div className="task-list">
                  {tasks.map((task, index) => (
                    <article className="task-sheet" key={task.title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div><h3>{task.title}</h3><p>{task.meta}</p></div>
                      <span className="task-check" aria-hidden="true"><Check size={14} /></span>
                    </article>
                  ))}
                </div>
                <div className="demo-result-actions">
                  <Link href="/projects/heard-sheep" className="button button-secondary">{t("viewCase")}</Link>
                  <a href={siteConfig.heardSheepLiveUrl} className="button button-primary" target="_blank" rel="noopener noreferrer">{t("openProduct")}<ArrowUpRight size={15} /></a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}