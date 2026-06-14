import type { MetadataRoute } from "next";

import { COMPONENT_IDS } from "@/app/constants/components";
import { absoluteUrl } from "@/app/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 1.0,
      url: absoluteUrl(),
    },
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 0.9,
      url: absoluteUrl("/excel"),
    },
  ];

  // Getting-started + component doc pages
  const docSlugs = [...COMPONENT_IDS];
  for (const slug of docSlugs) {
    routes.push({
      changeFrequency: "weekly",
      lastModified: now,
      priority: 0.8,
      url: absoluteUrl(`/docs/${slug}`),
    });
  }

  return routes;
}
