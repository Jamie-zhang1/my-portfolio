"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Mic, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";

export function HeroScene() {
  const t = useTranslations("Home.scene");
  const reduceMotion = useReducedMotion();
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const x = useSpring(offsetX, { stiffness: 70, damping: 18 });
  const y = useSpring(offsetY, { stiffness: 70, damping: 18 });
  const slowX = useSpring(offsetX, { stiffness: 45, damping: 16 });
  const slowY = useSpring(offsetY, { stiffness: 45, damping: 16 });
  const sheepX = useSpring(offsetX, { stiffness: 90, damping: 20 });

  const move = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    offsetX.set(((event.clientX - rect.left) / rect.width - 0.5) * 18);
    offsetY.set(((event.clientY - rect.top) / rect.height - 0.5) * 18);
  };

  const reset = () => {
    offsetX.set(0);
    offsetY.set(0);
  };

  return (
    <motion.div className="hero-scene" onMouseMove={move} onMouseLeave={reset} data-cursor="active">
      <div className="scene-noise" />
      <motion.div className="cloud cloud-a" style={{ x, y }} />
      <motion.div className="cloud cloud-b" style={{ x: slowX, y: slowY }} />

      <div className="scene-topline">
        <span><span className="live-dot" /> {t("live")}</span>
        <span>00:18</span>
      </div>

      <motion.div className="signal-card" style={{ x, y }}>
        <div className="signal-label"><Sparkles size={14} /> {t("understanding")}</div>
        <p>{t("quote")}</p>
        <div className="signal-tags"><span>{t("deadline")}</span><span>{t("outputs")}</span></div>
      </motion.div>

      <div className="wave-field" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => <span key={index} style={{ "--wave-index": index } as React.CSSProperties} />)}
      </div>

      <motion.div className="sheep-orbit" style={{ x: sheepX, y }}>
        <div className="orbit-ring" />
        <Image src="/images/sheep-mascot-main.png" alt="Heard Sheep mascot" width={240} height={240} priority sizes="(max-width: 768px) 180px, 240px" />
      </motion.div>

      <motion.button
        className="record-control"
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        animate={reduceMotion ? undefined : { boxShadow: ["0 0 0 0 rgba(124,111,247,.3)", "0 0 0 18px rgba(124,111,247,0)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label={t("recordAria")}
      >
        <Mic size={20} />
      </motion.button>

      <div className="scene-caption"><span>01</span><p>{t("caption")}</p></div>
    </motion.div>
  );
}
