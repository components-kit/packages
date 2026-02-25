"use client";

import type { ComponentDocs } from "@/app/types/showcase";

import { useBundleSync } from "@/app/hooks/use-bundle-sync";

import { ComponentShowcase } from "./showcase/component-showcase";
import { ThemeControls } from "./theme-controls";

/* ── Component ── */

export function ThemeConfigurator({
  componentDocs,
}: {
  componentDocs: ComponentDocs;
}) {
  useBundleSync();

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
