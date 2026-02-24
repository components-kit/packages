"use client";

import { useMemo } from "react";

import { useTheme } from "@/app/components/theme-context";

import { GradientVisual } from "./gradient-visual";

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
const GRAY_STEPS = ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

const PRIMARY_PALETTES: Record<string, Record<string, string>> = {
  amber:   { "50": "#FFFBEB", "100": "#FEF3C7", "200": "#FDE68A", "300": "#FCD34D", "400": "#FBBF24", "500": "#F59E0B", "600": "#D97706", "700": "#B45309", "800": "#92400E", "900": "#78350F", "950": "#451A03" },
  black:   { "50": "#FAFAFA", "100": "#F4F4F5", "200": "#E4E4E7", "300": "#D4D4D8", "400": "#A1A1AA", "500": "#71717A", "600": "#52525B", "700": "#3F3F46", "800": "#27272A", "900": "#18181B", "950": "#09090B" },
  blue:    { "50": "#EFF6FF", "100": "#DBEAFE", "200": "#BEDBFF", "300": "#8EC5FF", "400": "#51A2FF", "500": "#2B7FFF", "600": "#155DFC", "700": "#1447E6", "800": "#193CB8", "900": "#1C398E", "950": "#162456" },
  fuchsia: { "50": "#FDF4FF", "100": "#FAE8FF", "200": "#F5D0FE", "300": "#F0ABFC", "400": "#E879F9", "500": "#D946EF", "600": "#C026D3", "700": "#A21CAF", "800": "#86198F", "900": "#701A75", "950": "#4A044E" },
  green:   { "50": "#F0FDF4", "100": "#DCFCE7", "200": "#BBF7D0", "300": "#86EFAC", "400": "#4ADE80", "500": "#22C55E", "600": "#16A34A", "700": "#15803D", "800": "#166534", "900": "#14532D", "950": "#052E16" },
  indigo:  { "50": "#EEF2FF", "100": "#E0E7FF", "200": "#C7D2FE", "300": "#A5B4FC", "400": "#818CF8", "500": "#6366F1", "600": "#4F46E5", "700": "#4338CA", "800": "#3730A3", "900": "#312E81", "950": "#1E1B4B" },
  orange:  { "50": "#FFF7ED", "100": "#FFEDD5", "200": "#FED7AA", "300": "#FDBA74", "400": "#FB923C", "500": "#F97316", "600": "#EA580C", "700": "#C2410C", "800": "#9A3412", "900": "#7C2D12", "950": "#431407" },
  purple:  { "50": "#FAF5FF", "100": "#F3E8FF", "200": "#E9D5FF", "300": "#D8B4FE", "400": "#C084FC", "500": "#A855F7", "600": "#9333EA", "700": "#7E22CE", "800": "#6B21A8", "900": "#581C87", "950": "#3B0764" },
  red:     { "50": "#FEF2F2", "100": "#FEE2E2", "200": "#FECACA", "300": "#FCA5A5", "400": "#F87171", "500": "#EF4444", "600": "#DC2626", "700": "#B91C1C", "800": "#991B1B", "900": "#7F1D1D", "950": "#450A0A" },
  rose:    { "50": "#FFF1F2", "100": "#FFE4E6", "200": "#FECDD3", "300": "#FDA4AF", "400": "#FB7185", "500": "#F43F5E", "600": "#E11D48", "700": "#BE123C", "800": "#9F1239", "900": "#881337", "950": "#4C0519" },
  violet:  { "50": "#F5F3FF", "100": "#EDE9FE", "200": "#DDD6FE", "300": "#C4B5FD", "400": "#A78BFA", "500": "#8B5CF6", "600": "#7C3AED", "700": "#6D28D9", "800": "#5B21B6", "900": "#4C1D95", "950": "#2E1065" },
};

const GRAY_PALETTES: Record<string, Record<string, string>> = {
  gray:    { "0": "#FFFFFF", "50": "#F9FAFB", "100": "#F3F4F6", "200": "#E5E7EB", "300": "#D1D5DB", "400": "#9CA3AF", "500": "#6B7280", "600": "#4B5563", "700": "#374151", "800": "#1F2937", "900": "#111827", "950": "#030712" },
  mauve:   { "0": "#FFFFFF", "50": "#FBF8FC", "100": "#F5F0F7", "200": "#EBE0EE", "300": "#DCC9E1", "400": "#C4A3CB", "500": "#A87CB2", "600": "#8B5A97", "700": "#6E3F7A", "800": "#543162", "900": "#3F254C", "950": "#1A0F20" },
  mist:    { "0": "#FFFFFF", "50": "#F6FAFB", "100": "#EBF3F5", "200": "#D5E5E9", "300": "#B7D1D8", "400": "#8FB2BD", "500": "#6A919E", "600": "#507480", "700": "#3D5A64", "800": "#2E4550", "900": "#23353E", "950": "#0E1A1F" },
  neutral: { "0": "#FFFFFF", "50": "#FAFAFA", "100": "#F5F5F5", "200": "#E5E5E5", "300": "#D4D4D4", "400": "#A3A3A3", "500": "#737373", "600": "#525252", "700": "#404040", "800": "#262626", "900": "#171717", "950": "#0A0A0A" },
  olive:   { "0": "#FFFFFF", "50": "#FAFAF7", "100": "#F4F4ED", "200": "#E6E6D8", "300": "#D1D1BB", "400": "#ABAB8B", "500": "#878764", "600": "#6B6B48", "700": "#535337", "800": "#40402A", "900": "#313121", "950": "#14140C" },
  slate:   { "0": "#FFFFFF", "50": "#F8FAFC", "100": "#F1F5F9", "200": "#E2E8F0", "300": "#CAD5E2", "400": "#90A1B9", "500": "#62748E", "600": "#45556C", "700": "#314158", "800": "#1D293D", "900": "#0F172B", "950": "#020618" },
  stone:   { "0": "#FFFFFF", "50": "#FAFAF9", "100": "#F5F5F4", "200": "#E7E5E4", "300": "#D6D3D1", "400": "#A8A29E", "500": "#78716C", "600": "#57534E", "700": "#44403C", "800": "#292524", "900": "#1C1917", "950": "#0C0A09" },
  taupe:   { "0": "#FFFFFF", "50": "#FBF9F7", "100": "#F6F1EC", "200": "#ECE1D6", "300": "#DDCBB8", "400": "#C5A88C", "500": "#AD886A", "600": "#8F6A4E", "700": "#70503A", "800": "#573E2D", "900": "#433024", "950": "#1C130E" },
  zinc:    { "0": "#FFFFFF", "50": "#FAFAFA", "100": "#F4F4F5", "200": "#E4E4E7", "300": "#D4D4D8", "400": "#A1A1AA", "500": "#71717A", "600": "#52525B", "700": "#3F3F46", "800": "#27272A", "900": "#18181B", "950": "#09090B" },
};

function DevToolsPanel() {
  const { darkMode, grayScale, primaryColor } = useTheme();

  const panelBg = darkMode ? "#1e1e1e" : "oklch(97.5% 0.003 70)";
  const chromeBg = darkMode ? "#181818" : "oklch(96% 0.004 70)";

  const primaryPalette = PRIMARY_PALETTES[primaryColor] ?? PRIMARY_PALETTES.blue;
  const grayPalette = GRAY_PALETTES[grayScale] ?? GRAY_PALETTES.slate;

  const cssVariables = useMemo(
    () => [
      ...STEPS.map((step) => ({
        name: `--color-primary-${step}`,
        value: primaryPalette[step],
      })),
      ...GRAY_STEPS.map((step) => ({
        name: `--color-gray-${step}`,
        value: grayPalette[step],
      })),
    ],
    [primaryPalette, grayPalette],
  );

  return (
    <div
      className="absolute top-6 left-6 sm:top-10 sm:left-10 -right-4 -bottom-8 sm:-right-6 sm:-bottom-12 flex flex-col rounded-tl-lg overflow-hidden border border-neutral-200 shadow-2xl"
      style={{ backgroundColor: panelBg }}
    >
      {/* Window Chrome */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-200"
        style={{ backgroundColor: chromeBg }}
      >
        <div className="h-2 w-2 rounded-full bg-neutral-300" />
        <div className="h-2 w-2 rounded-full bg-neutral-300" />
        <div className="h-2 w-2 rounded-full bg-neutral-300" />
        <span className="ml-1.5 text-[10px] text-neutral-400 font-mono">
          DevTools
        </span>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-4 px-4 pt-2 border-b border-neutral-200 text-[10px] sm:text-[11px] font-mono">
        <span className="pb-1.5 text-neutral-400">
          Styles
        </span>
        <span className="pb-1.5 text-neutral-700 border-b-2 border-neutral-500">
          Computed
        </span>
        <span className="pb-1.5 text-neutral-400">
          Layout
        </span>
      </div>

      {/* Property List */}
      <div className="flex-1 overflow-hidden px-4 py-2 text-[11px] leading-4.5 sm:text-xs sm:leading-5 font-mono">
        <div className="text-neutral-700">:root {"{"}</div>
        <div className="pl-4">
          {cssVariables.map((v) => (
            <div
              key={v.name}
              className="flex items-center gap-1.5 py-px"
            >
              <span className="text-neutral-500 shrink-0">
                {v.name}:
              </span>
              <div
                className="h-2.75 w-2.75 shrink-0 border border-neutral-300"
                style={{ backgroundColor: v.value }}
              />
              <span className="text-neutral-700">
                {v.value};
              </span>
            </div>
          ))}
        </div>
        <div className="text-neutral-700">{"}"}</div>
      </div>
    </div>
  );
}

export function VariantSyncVisual() {
  return (
    <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(39% 0.025 68 / 0.5)", position: "-top-20 right-1/4", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(40% 0.015 75 / 0.6)", position: "top-1/3 -left-16", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(38% 0.025 55 / 0.4)", position: "-bottom-16 -right-12", size: "h-44 w-44" },
        ]}
        darkGradient="linear-gradient(110deg, oklch(40% 0.008 70) 0%, oklch(39% 0.015 65) 50%, oklch(38% 0.02 60) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(93% 0.018 68 / 0.5)", position: "-top-20 right-1/4", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(96% 0.008 75 / 0.6)", position: "top-1/3 -left-16", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(91% 0.02 55 / 0.4)", position: "-bottom-16 -right-12", size: "h-44 w-44" },
        ]}
        gradient="linear-gradient(110deg, oklch(97% 0.005 70) 0%, oklch(94% 0.01 65) 50%, oklch(91% 0.015 60) 100%)"
      />
      <DevToolsPanel />
    </div>
  );
}
