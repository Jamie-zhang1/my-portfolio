"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

type ConsoleField = { label: string; value: string };

type ProductConsoleProps = {
  ready: boolean;
};

export function ProductConsole({ ready }: ProductConsoleProps) {
  const t = useTranslations("Home.console");
  const fields = t.raw("fields") as ConsoleField[];
  const areas = t.raw("areas") as string[];
  const reduceMotion = useReducedMotion();

  return (
    <section id="console" className={`product-console site-shell ${ready ? "is-ready" : "is-standby"}`} aria-live="polite">
      <div className="console-toolbar">
        <span>{t("kicker")}</span>
        <span className="status-marker" data-state={ready ? "ready" : "standby"}>
          <i aria-hidden="true" />
          {ready ? t("ready") : t("standby")}
        </span>
      </div>
      <div className="console-body">
        <div className="console-profile">
          <p className="console-label">JAMIE ZHANG / AI PRODUCT BUILDER</p>
          <h2>{t("title")}</h2>
          <p className="console-intro">{t("intro")}</p>
          <p className="console-label console-focus-label">{t("focusLabel")}</p>
          <div className="console-chips">
            {areas.map((area) => <span key={area}>{area}</span>)}
          </div>
        </div>
        <div className="console-data" aria-label={t("title")}>
          {fields.map((field, index) => (
            <div className="console-field" key={field.label}>
              <span>{field.label}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.strong
                  key={ready ? field.value : "standby"}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.24, delay: ready ? index * 0.07 : 0 }}
                >
                  {ready ? field.value : "—"}
                </motion.strong>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}