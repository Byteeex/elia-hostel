import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: site.siteUrl ? new URL("/sitemap.xml", site.siteUrl).toString() : undefined };
}
