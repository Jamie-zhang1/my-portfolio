"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type BuildStep = { number: string; title: string; label: string; description: string };

export function BuildStory() {
  const t = useTranslations("Home.process");
  const steps = t.raw("steps") as BuildStep[];
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !root.current) return;

    let context: { revert: () => void } | undefined;
    let cancelled = false;
    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>("[data-method-step]");
        items.forEach((item, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 64%",
            end: "bottom 48%",
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          });
        });
      }, root);
    };
    void setup();
    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return (
    <div ref={root} className="build-method">
      <aside className="build-method-heading">
        <p className="section-kicker">{t("kicker")}</p>
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
        <div className="method-status">
          <span>{t("active")}</span>
          <strong>{steps[active].number} / {steps[active].label}</strong>
        </div>
      </aside>
      <div className="method-steps">
        {steps.map((step, index) => (
          <article className={index === active ? "is-active" : ""} data-method-step key={step.number}>
            <div className="method-node"><span>{step.number}</span><i aria-hidden="true" /></div>
            <div>
              <p className="eyebrow-label">{step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}