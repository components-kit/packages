import type { Token, Tokens } from "marked";

import type { GitHubRelease } from "@/app/types/landing";
import type { ComponentDocs } from "@/app/types/showcase";

// Generated at build time by scripts/generate-component-docs.mjs.
// This avoids runtime fs reads that fail in Vercel's serverless environment.
import componentDocsData from "@/app/generated/component-docs.json";

export function getComponentDocs(): ComponentDocs {
  return componentDocsData as ComponentDocs;
}

/** Get doc tokens for a single component by its slug (e.g. "button", "multi-select"). */
export function getComponentDocBySlug(slug: string): Token[] | null {
  const docs = getComponentDocs();
  return docs[slug] ?? null;
}

/** Extract display name from the first h1 heading in tokens. */
export function getComponentDisplayName(tokens: Token[]): string {
  for (const token of tokens) {
    if (token.type === "heading" && (token as Tokens.Heading).depth === 1) {
      return (token as Tokens.Heading).text;
    }
  }
  return "";
}

/** Extract the first paragraph text from tokens for use as meta description. */
export function getComponentDescription(tokens: Token[]): string {
  for (const token of tokens) {
    if (token.type === "paragraph") {
      return (token as Tokens.Paragraph).text;
    }
  }
  return "";
}

export async function getReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(
    "https://api.github.com/repos/components-kit/packages/releases",
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  return res.json();
}
