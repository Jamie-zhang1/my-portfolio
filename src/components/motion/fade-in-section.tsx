"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function FadeInSection({ children, className, id }: FadeInSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: motionTokens.distance.section }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.gentle }}
    >
      {children}
    </motion.section>
  );
}
