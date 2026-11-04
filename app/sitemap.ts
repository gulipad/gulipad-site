import type { MetadataRoute } from "next";

import { getWritings } from "@/lib/writings";

const SITE_URL = "https://www.gulipad.com";

// lastModified is only set where we know the real date. Stamping every URL
// with the build time tells crawlers everything changed on every deploy, so
// they learn to ignore the field.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about.md`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/api/bio`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...getWritings().map((writing) => ({
      url: `${SITE_URL}/writings/${writing.slug}`,
      // Only full dates are precise enough to be a useful signal.
      ...(/^\d{4}-\d{2}-\d{2}$/.test(writing.date)
        ? { lastModified: writing.date }
        : {}),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
