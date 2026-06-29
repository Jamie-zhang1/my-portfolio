"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

type StaggerListProps = {
  children: ReactNode;
  className?: string;
};

type StaggerItemProps = {
  as?: "div" | "article";
  children: ReactNode;
  className?: string;
};

export function StaggerList({ children, className }: StaggerListProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.14 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ as = "div", children, className }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const props = {
    className,
    variants: {
      hidden: { opacity: 0, y: reduceMotion ? 0 : motionTokens.distance.small },
      show: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.gentle } },
    },
  };

  if (as === "article") {
    return <motion.article {...props}>{children}</motion.article>;
  }

  return <motion.div {...props}>{children}</motion.div>;
}
