import type { Metadata } from "next";

import { MarkdownRenderer } from "@/app/components/ui/markdown-renderer";
import { COMPONENT_IDS } from "@/app/constants/components";
import {
  getComponentDescription,
  getComponentDisplayName,
  getComponentDocBySlug,
} from "@/app/lib/landing-data";

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

  return {
    alternates: {
      canonical: `https://componentskit.com/docs/${component}`,
    },
    description,
    openGraph: {
      description,
      siteName: "ComponentsKit",
      title,
      type: "article",
      url: `https://componentskit.com/docs/${component}`,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
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
