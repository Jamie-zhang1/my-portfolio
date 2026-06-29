"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type AnimatedSegmentedControlProps<T extends string> = {
  ariaLabel: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function AnimatedSegmentedControl<T extends string>({ ariaLabel, options, value, onChange, className = "" }: AnimatedSegmentedControlProps<T>) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`animated-segmented ${className}`} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button key={option.value} type="button" className={active ? "is-active" : ""} onClick={() => onChange(option.value)} aria-pressed={active}>
            {active && !reduceMotion ? (
              <motion.span
                className="animated-segmented-pill"
                layoutId={`${ariaLabel}-active-pill`}
                transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.standard }}
                aria-hidden="true"
              />
            ) : null}
            {active && reduceMotion ? <span className="animated-segmented-pill" aria-hidden="true" /> : null}
            <span className="animated-segmented-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
