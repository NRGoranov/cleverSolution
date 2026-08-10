import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Draft products are never routed publicly — only published slugs exist as pages.
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
