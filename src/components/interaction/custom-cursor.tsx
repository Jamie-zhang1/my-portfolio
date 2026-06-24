"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const pointerX = useMotionValue(-40);
  const pointerY = useMotionValue(-40);
  const x = useSpring(pointerX, { stiffness: 520, damping: 34, mass: 0.12 });
  const y = useSpring(pointerY, { stiffness: 520, damping: 34, mass: 0.12 });

  useEffect(() => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (event: PointerEvent) => {
      pointerX.set(event.clientX - 8);
      pointerY.set(event.clientY - 8);
      setVisible(true);
      setActive(Boolean((event.target as HTMLElement).closest("a, button, [data-cursor='active']")));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [pointerX, pointerY, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="custom-cursor"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0, scale: active ? 2.25 : 1 }}
      transition={{ duration: 0.16 }}
    />
  );
}
