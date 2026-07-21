"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function FadeInSection({ children, className, id }: FadeInSectionProps) {
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(Boolean(reduceMotion));

  return (
    <motion.section
      id={id}
      className={className}
      data-in-view={inView ? "true" : undefined}
      initial={reduceMotion ? false : { opacity: 0, y: motionTokens.distance.section }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.gentle }}
    >
      {children}
    </motion.section>
  );
}