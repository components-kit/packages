"use client";

import { useEffect, useMemo } from "react";

import type { ComponentDocs } from "@/app/types/showcase";

import { buildBundleUrl } from "@/app/utils/build-bundle-url";

import { ComponentShowcase } from "./showcase/component-showcase";
import { useTheme } from "./theme-context";
import { ThemeControls } from "./theme-controls";

/* ── Component ── */

export function ThemeConfigurator({
  componentDocs,
}: {
  componentDocs: ComponentDocs;
}) {
  const { borderRadius, darkMode, grayScale, primaryColor } = useTheme();

  const url = useMemo(
    () => buildBundleUrl(primaryColor, grayScale, borderRadius),
    [primaryColor, grayScale, borderRadius],
  );

  /* Swap the bundle <link> href when theme changes (preload-then-swap) */
  useEffect(() => {
    const oldLink = document.getElementById(
      "ck-bundle",
    ) as HTMLLinkElement | null;
    if (!oldLink || oldLink.href === url) return undefined;

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = url;

    newLink.onload = () => {
      oldLink.remove();
      newLink.id = "ck-bundle";
    };

    newLink.onerror = () => {
      newLink.remove();
    };

    document.head.appendChild(newLink);

    return () => {
      if (!newLink.id && newLink.parentNode) {
        newLink.remove();
      }
    };
  }, [url]);

  /* Dark mode class toggle (for globals.css dark overrides) */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    root.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <section id="showcase" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-medium">Components</h2>
      <p className="mt-2 max-w-lg text-neutral-500">
        The functional building blocks of your design system. From inputs and
        buttons to toggles and sliders, every component is a pure, accessible
        atom pre-wired with WAI-ARIA support and keyboard navigation. We provide
        the raw functional core, allowing you to compose complex layouts via a
        flat, predictable prop structure with zero architectural bloat.
      </p>

      {/* ── Configurator ── */}
      <div className="mt-8">
        <ThemeControls showDarkMode />
      </div>

      {/* ── Component Grid ── */}
      <ComponentShowcase componentDocs={componentDocs} />
    </section>
  );
}
