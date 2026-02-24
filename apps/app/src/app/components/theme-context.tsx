"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ThemeState } from "@/app/types/theme";

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [grayScale, setGrayScale] = useState("slate");
  const [borderRadius, setBorderRadius] = useState("8px");
  const [darkMode, setDarkMode] = useState(false);
  const hydrated = useRef(false);

  /* Sync initial state from localStorage / system preference (client only) */
  useEffect(() => {
    const stored = localStorage.getItem("ck-dark-mode");
    const initial =
      stored !== null
        ? stored === "true"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(initial);
    hydrated.current = true;
  }, []);

  /* Persist changes (skip first render to avoid overwriting localStorage) */
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem("ck-dark-mode", String(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        borderRadius,
        darkMode,
        grayScale,
        primaryColor,
        setBorderRadius,
        setDarkMode,
        setGrayScale,
        setPrimaryColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
