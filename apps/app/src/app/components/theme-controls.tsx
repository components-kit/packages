"use client";

import {
  BORDER_RADIUS_OPTIONS,
  GRAY_SCALES,
  PRIMARY_COLORS,
} from "@/app/constants/theme";

import { useTheme } from "./theme-context";
import { Tooltip } from "./tooltip";
import { CompactSelect } from "./ui/compact-select";
import { SwatchButton } from "./ui/swatch-button";
import { ToggleSwitch } from "./ui/toggle-switch";

/* ── Component ── */

interface ThemeControlsProps {
  showDarkMode?: boolean;
}

export function ThemeControls({ showDarkMode = true }: ThemeControlsProps) {
  const {
    borderRadius,
    darkMode,
    grayScale,
    primaryColor,
    setBorderRadius,
    setDarkMode,
    setGrayScale,
    setPrimaryColor,
  } = useTheme();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      {/* Primary Color — swatches on sm+, dropdown on mobile */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-neutral-700">Color</span>
        <div className="hidden gap-1.5 sm:flex">
          {PRIMARY_COLORS.map((color) => (
            <Tooltip key={color.name} content={color.name} openDelay={60}>
              <SwatchButton
                active={primaryColor === color.name}
                ariaLabel={color.name}
                color={darkMode ? color.hexDark : color.hex}
                onClick={() => setPrimaryColor(color.name)}
              />
            </Tooltip>
          ))}
        </div>
        <CompactSelect
          className="sm:hidden"
          aria-label="Primary color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        >
          {PRIMARY_COLORS.map((color) => (
            <option key={color.name} value={color.name}>
              {color.name}
            </option>
          ))}
        </CompactSelect>
      </div>

      {/* Separator */}
      <div className="hidden sm:block h-6 w-px bg-neutral-200" />

      {/* Gray Scale — swatches on sm+, dropdown on mobile */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-neutral-700">Gray Scale</span>
        <div className="hidden gap-1.5 sm:flex">
          {GRAY_SCALES.map((g) => (
            <Tooltip key={g.name} content={g.name} openDelay={60}>
              <SwatchButton
                active={grayScale === g.name}
                ariaLabel={g.name}
                color={darkMode ? g.hexDark : g.hex}
                onClick={() => setGrayScale(g.name)}
              />
            </Tooltip>
          ))}
        </div>
        <CompactSelect
          className="sm:hidden"
          aria-label="Gray scale"
          value={grayScale}
          onChange={(e) => setGrayScale(e.target.value)}
        >
          {GRAY_SCALES.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </CompactSelect>
      </div>

      {/* Separator */}
      <div className="hidden sm:block h-6 w-px bg-neutral-200" />

      {/* Border Radius */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-neutral-700">Radius</span>
        <CompactSelect
          aria-label="Border radius"
          value={borderRadius}
          onChange={(e) => setBorderRadius(e.target.value)}
        >
          {BORDER_RADIUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </CompactSelect>
      </div>

      {showDarkMode && (
        <>
          {/* Separator */}
          <div className="hidden sm:block h-6 w-px bg-neutral-200" />

          {/* Dark Mode */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-neutral-700">
              {darkMode ? "Dark" : "Light"}
            </span>
            <ToggleSwitch
              ariaLabel="Toggle dark mode"
              checked={darkMode}
              onToggle={() => setDarkMode((d: boolean) => !d)}
            />
          </div>
        </>
      )}
    </div>
  );
}
