import type { ColorOption, GrayScaleOption } from "@/app/types/theme";

export const PRIMARY_COLORS: readonly ColorOption[] = [
  { hex: "#DC5F5F", hexDark: "#9B3A3A", name: "red" },
  { hex: "#D4637B", hexDark: "#943D55", name: "rose" },
  { hex: "#B968C7", hexDark: "#7E3F8C", name: "fuchsia" },
  { hex: "#9672C4", hexDark: "#6A4A8E", name: "purple" },
  { hex: "#7E72C2", hexDark: "#564A8E", name: "violet" },
  { hex: "#6B73B8", hexDark: "#454B82", name: "indigo" },
  { hex: "#5B8EC4", hexDark: "#3A628E", name: "blue" },
  { hex: "#5BA882", hexDark: "#3A7458", name: "green" },
  { hex: "#C4A24E", hexDark: "#8A7030", name: "amber" },
  { hex: "#D08752", hexDark: "#925C34", name: "orange" },
  { hex: "#3D3835", hexDark: "#2A2624", name: "black" },
];

export const GRAY_SCALES: readonly GrayScaleOption[] = [
  { hex: "#374151", hexDark: "#9CA3AF", name: "gray" },
  { hex: "#46364B", hexDark: "#A78BAE", name: "mauve" },
  { hex: "#3D4A4F", hexDark: "#8DA3AD", name: "mist" },
  { hex: "#404040", hexDark: "#A3A3A3", name: "neutral" },
  { hex: "#464538", hexDark: "#A3A28C", name: "olive" },
  { hex: "#334155", hexDark: "#94A3B8", name: "slate" },
  { hex: "#44403C", hexDark: "#A8A29E", name: "stone" },
  { hex: "#4D3F35", hexDark: "#A8957F", name: "taupe" },
  { hex: "#3F3F46", hexDark: "#A1A1AA", name: "zinc" },
];

/** oklch hue channel for each primary color — used to tint showcase card backgrounds */
export const PRIMARY_COLOR_HUES: Record<string, number> = {
  amber: 75,
  black: 60,
  blue: 255,
  fuchsia: 320,
  green: 150,
  indigo: 270,
  orange: 50,
  purple: 300,
  red: 25,
  rose: 350,
  violet: 285,
};

export const BORDER_RADIUS_OPTIONS = [
  "0px",
  "2px",
  "4px",
  "6px",
  "8px",
  "12px",
  "16px",
  "24px",
  "32px",
] as const;
