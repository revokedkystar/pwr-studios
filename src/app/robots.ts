import type { MetadataRoute } from "next";
import { siteUrl } from "@/content";

/** /robots.txt: lets search engines crawl the site and points them at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
