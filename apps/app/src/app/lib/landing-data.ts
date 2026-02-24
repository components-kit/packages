import { marked } from "marked";
import fs from "node:fs/promises";
import path from "node:path";

import type { GitHubRelease } from "@/app/types/landing";
import type { ComponentDocs } from "@/app/types/showcase";

import { COMPONENT_IDS } from "@/app/constants/components";

const COMPONENTS_DIR = path.resolve(
  process.cwd(),
  "../../libs/react/src/components",
);

export async function getComponentDocs(): Promise<ComponentDocs> {
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
}

export async function getReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(
    "https://api.github.com/repos/components-kit/packages/releases",
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  return res.json();
}
