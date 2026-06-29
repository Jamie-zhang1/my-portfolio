"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

type ToastFeedbackProps = {
  message: string;
};

export function ToastFeedback({ message }: ToastFeedbackProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          className="toast-feedback"
          role="status"
          aria-live="polite"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.gentle }}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
