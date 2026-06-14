export const SITE_URL = "https://componentskit.com";
export const SITE_NAME = "ComponentsKit";
export const SITE_LOCALE = "en_US";

export const DEFAULT_OG_TITLE =
  "ComponentsKit — Accessible React Components, Zero Complexity";

export const DEFAULT_META_DESCRIPTION =
  "AI-ready React components with designer-led variants. Sync via CLI for type-safe, accessible UI with less setup.";

export const DEFAULT_OG_DESCRIPTION =
  "AI-ready React components with designer-led variants. Sync via CLI for type-safe, accessible UI with less setup.";

export const DEFAULT_OG_IMAGE = "/og/componentskit-props-driven.png";
export const DEFAULT_OG_IMAGE_ALT =
  "ComponentsKit props-driven React component API preview";

export const DEFAULT_OG_IMAGE_METADATA = {
  alt: DEFAULT_OG_IMAGE_ALT,
  height: 630,
  url: DEFAULT_OG_IMAGE,
  width: 1200,
} as const;

export const DEFAULT_KEYWORDS = [
  "ComponentsKit",
  "React components",
  "accessible React components",
  "design system",
  "component library",
  "TypeScript components",
  "props-driven API",
  "AI-ready components",
  "Figma design system sync",
] as const;

export function absoluteUrl(path = ""): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
