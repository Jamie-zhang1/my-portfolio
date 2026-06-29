"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme, type ThemeMode } from "@/components/interaction/theme-provider";

const modes: Array<{ mode: ThemeMode; icon: typeof Sun }> = [
  { mode: "light", icon: Sun },
  { mode: "dark", icon: Moon },
  { mode: "system", icon: Monitor },
];

export function ThemeSwitcher({ compact = false }: Readonly<{ compact?: boolean }>) {
  const t = useTranslations("Theme");
  const { mode, setMode } = useTheme();
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? {} : { whileHover: { y: -1 }, whileTap: { scale: 0.96 }, transition: { duration: 0.14, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className={`theme-switcher ${compact ? "is-compact" : ""}`} role="group" aria-label={t("groupLabel")}>
      {modes.map(({ mode: option, icon: Icon }) => (
        <motion.button
          key={option}
          type="button"
          className={mode === option ? "is-active" : ""}
          onClick={() => setMode(option)}
          aria-pressed={mode === option}
          aria-label={t(`set.${option}`)}
          title={t(`set.${option}`)}
          {...motionProps}
        >
          <Icon size={14} aria-hidden="true" />
          {!compact && <span>{t(option)}</span>}
        </motion.button>
      ))}
    </div>
  );
}

