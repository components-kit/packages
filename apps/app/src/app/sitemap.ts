import type { MetadataRoute } from "next";

import { COMPONENT_IDS } from "@/app/constants/components";

const BASE_URL = "https://componentskit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 1.0,
      url: BASE_URL,
    },
  ];

  // Getting-started + component doc pages
  const docSlugs = [...COMPONENT_IDS];
  for (const slug of docSlugs) {
    routes.push({
      changeFrequency: "weekly",
      lastModified: now,
      priority: 0.8,
      url: `${BASE_URL}/docs/${slug}`,
    });
  }

  return routes;
}
