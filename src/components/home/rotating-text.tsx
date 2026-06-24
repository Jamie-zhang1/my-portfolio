"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function RotatingText({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % roles.length), 2400);
    return () => window.clearInterval(timer);
  }, [reduceMotion, roles.length]);

  return (
    <span className="rotating-text" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={roles[index]}
          initial={reduceMotion ? false : { y: 20, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? undefined : { y: -20, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
