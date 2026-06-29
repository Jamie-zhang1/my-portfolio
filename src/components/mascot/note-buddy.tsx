"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

export type NoteBuddyState = "idle" | "hover" | "writing" | "saved" | "empty" | "thinking";

type NoteBuddyProps = {
  state?: NoteBuddyState;
  size?: "sm" | "md" | "lg";
  label?: string;
  reducedMotion?: boolean;
};

const sizeClass = {
  sm: "note-buddy-sm",
  md: "note-buddy-md",
  lg: "note-buddy-lg",
};

export function NoteBuddy({ state = "idle", size = "md", label = "Note Buddy", reducedMotion }: NoteBuddyProps) {
  const prefersReduced = useReducedMotion();
  const reduce = reducedMotion ?? Boolean(prefersReduced);
  const isSaved = state === "saved";
  const isThinking = state === "thinking";
  const isWriting = state === "writing";
  const isEmpty = state === "empty";
  const handRotate = state === "hover" || isSaved ? -14 : isWriting ? -5 : 0;

  return (
    <motion.figure
      className={`note-buddy ${sizeClass[size]}`}
      data-state={state}
      aria-label={label}
      initial={false}
      animate={reduce ? {} : { y: isSaved ? -3 : [0, -2, 0] }}
      transition={reduce ? undefined : { duration: isSaved ? 0.28 : 3.8, repeat: isSaved ? 0 : Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 220 220" role="img" aria-labelledby="note-buddy-title note-buddy-desc">
        <title id="note-buddy-title">{label}</title>
        <desc id="note-buddy-desc">A small original paper-note character holding a pencil.</desc>
        <motion.g className="note-buddy-shadow" animate={reduce ? {} : { scaleX: isSaved ? 0.9 : [1, 0.96, 1] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
          <ellipse cx="110" cy="193" rx="52" ry="10" />
        </motion.g>
        <motion.g
          className="note-buddy-body"
          animate={reduce ? {} : { rotate: isThinking ? [-1, 1, -1] : 0 }}
          transition={{ duration: 2.4, repeat: isThinking ? Infinity : 0, ease: "easeInOut" }}
          style={{ transformOrigin: "110px 112px" }}
        >
          <path className="note-buddy-paper" d="M66 42h72l28 29v86c0 13-10 23-23 23H77c-13 0-23-10-23-23V54c0-7 5-12 12-12Z" />
          <path className="note-buddy-fold" d="M138 43v26c0 5 4 9 9 9h20" />
          <path className="note-buddy-line" d="M78 134h62M78 149h48" />
          <motion.path
            className="note-buddy-mouth"
            d={isEmpty ? "M99 120c7-5 15-5 22 0" : isSaved ? "M96 120c8 9 20 9 28 0" : "M99 120c7 6 17 6 24 0"}
            animate={reduce ? {} : { pathLength: [0.75, 1, 0.75] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle className="note-buddy-cheek" cx="84" cy="112" r="5" />
          <circle className="note-buddy-cheek" cx="136" cy="112" r="5" />
          <motion.g animate={reduce ? {} : { scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.86, 0.89, 0.92, 1] }}>
            <circle className="note-buddy-eye" cx="94" cy="103" r="4" />
            <circle className="note-buddy-eye" cx="126" cy="103" r="4" />
          </motion.g>
          {isThinking ? <path className="note-buddy-thought" d="M151 95c9-10 16-10 21-3 5 8-2 17-16 20" /> : null}
        </motion.g>
        <motion.g className="note-buddy-arm left" animate={reduce ? {} : { rotate: handRotate }} transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.gentle }} style={{ transformOrigin: "71px 137px" }}>
          <path d="M69 135c-14 7-20 18-17 30" />
          <circle cx="52" cy="165" r="5" />
        </motion.g>
        <motion.g
          className="note-buddy-arm right"
          animate={reduce ? {} : { rotate: isWriting ? [0, -9, 4, -7, 0] : isSaved ? -18 : state === "hover" ? -11 : 0 }}
          transition={isWriting ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: motionTokens.duration.slow, ease: motionTokens.easing.gentle }}
          style={{ transformOrigin: "149px 136px" }}
        >
          <path d="M149 136c17 5 26 15 27 28" />
          <path className="note-buddy-pencil" d="M174 163l19-18 7 7-19 18-9 2Z" />
        </motion.g>
        {isSaved ? (
          <motion.g className="note-buddy-ticket" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <rect x="78" y="68" width="64" height="34" rx="10" />
            <path d="m95 85 10 8 20-18" />
          </motion.g>
        ) : null}
        {isEmpty ? <path className="note-buddy-empty-page" d="M82 75h56M82 90h38" /> : null}
      </svg>
    </motion.figure>
  );
}
