import type { GitHubRelease } from "@/app/types/landing";
import type { ComponentDocs } from "@/app/types/showcase";

// Generated at build time by scripts/generate-component-docs.mjs.
// This avoids runtime fs reads that fail in Vercel's serverless environment.
import componentDocsData from "@/app/generated/component-docs.json";

export function getComponentDocs(): ComponentDocs {
  return componentDocsData as ComponentDocs;
}

export async function getReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(
    "https://api.github.com/repos/components-kit/packages/releases",
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  return res.json();
}
