import type { MetadataRoute } from "next";
import { siteUrl } from "@/content";

/**
 * /sitemap.xml: the site's pages, for search engines. Add new pages here.
 * No lastModified: a date that changes on every request would only tell
 * search engines that it can't be trusted.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/cv`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
