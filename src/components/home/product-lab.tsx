"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, FileText, ListTodo, RotateCcw, Sparkles, WandSparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type LabState = "idle" | "understanding" | "structuring" | "ready";

export function ProductLab() {
  const t = useTranslations("Home.lab");
  const examples = t.raw("examples") as string[];
  const [input, setInput] = useState(examples[0]);
  const [state, setState] = useState<LabState>("idle");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (state !== "understanding" && state !== "structuring") return;
    const timer = window.setTimeout(
      () => setState(state === "understanding" ? "structuring" : "ready"),
      reduceMotion ? 50 : 700,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, state]);

  const output = useMemo(() => {
    const decision = /比较|决策|选择|compare|decision|choose/i.test(input);
    const document = /文档|说明|交付|document|delivery|guide/i.test(input);
    return {
      intent: decision ? t("outputs.decisionIntent") : document ? t("outputs.documentIntent") : t("outputs.taskIntent"),
      task: decision ? t("outputs.decisionTask") : document ? t("outputs.documentTask") : t("outputs.taskTask"),
      artifact: decision ? t("outputs.decisionArtifact") : document ? t("outputs.documentArtifact") : t("outputs.taskArtifact"),
    };
  }, [input, t]);

  const run = () => {
    if (!input.trim() || state === "understanding" || state === "structuring") return;
    setState("understanding");
  };

  const reset = () => setState("idle");

  return (
    <div className="lab-console">
      <div className="lab-input-panel">
        <div className="lab-panel-head"><span><span className="live-dot" /> {t("request")}</span><small>{t("localDemo")}</small></div>
        <label htmlFor="lab-request">{t("inputLabel")}</label>
        <textarea id="lab-request" value={input} onChange={(event) => { setInput(event.target.value); setState("idle"); }} rows={5} />
        <div className="lab-examples">
          {examples.map((example, index) => <button key={example} onClick={() => { setInput(example); setState("idle"); }}>0{index + 1}</button>)}
          <span>{t("examplesLabel")}</span>
        </div>
        <button className="button button-primary lab-run" onClick={run} disabled={!input.trim() || state === "understanding" || state === "structuring"}>
          {state === "idle" ? <>{t("run")} <ArrowRight size={16} /></> : state === "ready" ? <>{t("runAgain")} <RotateCcw size={16} /></> : <>{t("processing")} <span className="processing-dot" /></>}
        </button>
        <p className="lab-disclaimer">{t("disclaimer")}</p>
      </div>

      <div className="lab-output-panel">
        <div className="pipeline" aria-label="AI product pipeline">
          {[
            ["01", (t.raw("pipeline") as string[])[0], "understanding"],
            ["02", (t.raw("pipeline") as string[])[1], "structuring"],
            ["03", (t.raw("pipeline") as string[])[2], "ready"],
          ].map(([number, label, key], index) => {
            const states = ["understanding", "structuring", "ready"];
            const activeIndex = states.indexOf(state);
            const stepIndex = states.indexOf(key as LabState);
            const complete = state === "ready" || (activeIndex > stepIndex && activeIndex !== -1);
            const active = state === key;
            return (
              <div className={`pipeline-step ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}`} key={key}>
                <span>{complete ? <Check size={14} /> : number}</span><p>{label}</p>{index < 2 && <i />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {state === "idle" ? (
            <motion.div key="empty" className="lab-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WandSparkles size={28} /><h3>{t("emptyTitle")}</h3><p>{t("emptyBody")}</p>
            </motion.div>
          ) : state !== "ready" ? (
            <motion.div key="working" className="lab-working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="thinking-orb"><Sparkles size={24} /></div><h3>{state === "understanding" ? t("thinking") : t("structuring")}</h3>
            </motion.div>
          ) : (
            <motion.div key="result" className="lab-result" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="result-card result-intent"><span><Sparkles size={16} /> {t("aiUnderstanding")}</span><strong>{output.intent}</strong><p>{t("intentHint")}</p></div>
              <div className="result-grid">
                <div className="result-card"><span><ListTodo size={16} /> {t("nextTask")}</span><strong>{output.task}</strong><p>{t("owner")}</p></div>
                <div className="result-card"><span><FileText size={16} /> {t("artifact")}</span><strong>{output.artifact}</strong><p>{t("confirmHint")}</p></div>
              </div>
              <button className="result-reset" onClick={reset}>{t("clear")}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
