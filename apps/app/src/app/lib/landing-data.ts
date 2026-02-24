import { marked } from "marked";
import { unstable_cache } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";

import type { GitHubRelease } from "@/app/types/landing";
import type { ComponentDocs } from "@/app/types/showcase";

import { COMPONENT_IDS } from "@/app/constants/components";

const COMPONENTS_DIR = path.resolve(
  process.cwd(),
  "../../libs/react/src/components",
);

// Wrapped in unstable_cache so docs are read from disk at build time and
// persisted across ISR revalidations (the source files don't exist in the
// Vercel serverless runtime).
export const getComponentDocs = unstable_cache(
  async (): Promise<ComponentDocs> => {
    const entries = await Promise.all(
      COMPONENT_IDS.map(async (id) => {
        try {
          const raw = await fs.readFile(
            path.join(COMPONENTS_DIR, id, "README.md"),
            "utf-8",
          );
          const tokens = [...marked.lexer(raw)];
          return [id, tokens] as const;
        } catch {
          return [id, []] as const;
        }
      }),
    );

    return Object.fromEntries(entries);
  },
  ["component-docs"],
  { revalidate: false },
);

export async function getReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(
    "https://api.github.com/repos/components-kit/packages/releases",
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  return res.json();
}
