"use client";

import { Monitor, Moon, Sun } from "lucide-react";
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

  return (
    <div className={`theme-switcher ${compact ? "is-compact" : ""}`} role="group" aria-label={t("groupLabel")}>
      {modes.map(({ mode: option, icon: Icon }) => (
        <button
          key={option}
          type="button"
          className={mode === option ? "is-active" : ""}
          onClick={() => setMode(option)}
          aria-pressed={mode === option}
          aria-label={t(`set.${option}`)}
          title={t(`set.${option}`)}
        >
          <Icon size={14} aria-hidden="true" />
          {!compact && <span>{t(option)}</span>}
        </button>
      ))}
    </div>
  );
}
