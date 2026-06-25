"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

const THEME_STORAGE_KEY = "jamie-theme-mode";
const THEME_EVENT = "jamie-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || stored === "system" || stored === "light" ? stored : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? getSystemTheme() : mode;
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolvedTheme = resolveTheme(mode);
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.style.colorScheme = resolvedTheme;
}

function getSnapshot() {
  const mode = readStoredMode();
  applyTheme(mode);
  return `${mode}:${resolveTheme(mode)}`;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const notify = () => callback();
  const notifySystem = () => {
    if (readStoredMode() === "system") callback();
  };
  window.addEventListener(THEME_EVENT, notify);
  window.addEventListener("storage", notify);
  media.addEventListener("change", notifySystem);
  return () => {
    window.removeEventListener(THEME_EVENT, notify);
    window.removeEventListener("storage", notify);
    media.removeEventListener("change", notifySystem);
  };
}

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "light:light");
  const [mode, resolvedTheme] = snapshot.split(":") as [ThemeMode, ResolvedTheme];

  const setMode = (nextMode: ThemeMode) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    applyTheme(nextMode);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const value = useMemo(() => ({ mode, resolvedTheme, setMode }), [mode, resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
