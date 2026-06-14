import type { Metadata } from "next";

import { MarkdownRenderer } from "@/app/components/ui/markdown-renderer";
import { COMPONENT_IDS } from "@/app/constants/components";
import {
  getComponentDescription,
  getComponentDisplayName,
  getComponentDocBySlug,
} from "@/app/lib/landing-data";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_METADATA,
  SITE_NAME,
} from "@/app/metadata";

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function generateStaticParams() {
  return COMPONENT_IDS.map((id) => ({ component: id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ component: string }>;
}): Promise<Metadata> {
  const { component } = await params;
  const tokens = getComponentDocBySlug(component);
  const displayName = tokens
    ? getComponentDisplayName(tokens) || formatSlug(component)
    : formatSlug(component);
  const description = tokens
    ? getComponentDescription(tokens) ||
      `Documentation and interactive preview for the ${displayName} component.`
    : `Documentation and interactive preview for the ${displayName} component.`;

  const title = `${displayName} — ComponentsKit`;
  const canonicalUrl = absoluteUrl(`/docs/${component}`);

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    description,
    keywords: [
      displayName,
      `${displayName} React component`,
      `${displayName} accessibility`,
      "ComponentsKit docs",
      "React component documentation",
      "TypeScript React components",
    ],
    openGraph: {
      description,
      images: [DEFAULT_OG_IMAGE_METADATA],
      siteName: SITE_NAME,
      title,
      type: "article",
      url: canonicalUrl,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [DEFAULT_OG_IMAGE],
      title,
    },
  };
}

export default async function ComponentDocPage({
  params,
}: {
  params: Promise<{ component: string }>;
}) {
  const { component } = await params;
  const tokens = getComponentDocBySlug(component) ?? [];

  return <MarkdownRenderer tokens={tokens} />;
}
