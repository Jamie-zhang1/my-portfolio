"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  download?: boolean;
};

export function MagneticLink({ href, children, className = "", external, download }: MagneticLinkProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 250, damping: 20, mass: 0.35 });

  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: springX, y: springY }}>
      <Link
        href={href}
        className={className}
        onMouseMove={move}
        onMouseLeave={reset}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download || undefined}
      >
        {children}
      </Link>
    </motion.div>
  );
}
