"use client";

import { BrainCircuit, CodeXml, Rocket, ScanSearch, TestTube2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const icons = [ScanSearch, BrainCircuit, CodeXml, TestTube2, Rocket];
type BuildStep = { number: string; title: string; cn: string; description: string; signal: string };

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
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-build-step]");
        cards.forEach((card, index) => {
          gsap.fromTo(card, { opacity: 0.35, y: 32 }, {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: card,
              start: "top 72%",
              end: "bottom 48%",
              toggleActions: "play reverse play reverse",
              onEnter: () => setActive(index),
              onEnterBack: () => setActive(index),
            },
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
    <div ref={root} className="build-story">
      <aside className="build-sticky">
        <p className="section-kicker">{t("kicker")}</p>
        <h2>{t("title1")}<br />{t("title2")}</h2>
        <p>{t("description")}</p>
        <div className="build-progress"><span style={{ transform: `scaleY(${(active + 1) / steps.length})` }} /></div>
        <div className="build-status"><small>{t("active")}</small><strong>{steps[active].number} / {steps[active].signal}</strong></div>
      </aside>
      <div className="build-steps">
        {steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <article key={step.number} data-build-step className={index === active ? "is-active" : ""}>
              <div className="build-step-visual">
                <span>{step.number}</span>
                <div className="build-icon"><Icon size={34} strokeWidth={1.4} /></div>
                <i />
              </div>
              <div><p>{step.cn}</p><h3>{step.title}</h3><span>{step.description}</span></div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
