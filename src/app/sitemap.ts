import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.siteUrl) return [];
  return ["", "/about", "/why-elia", "/contact", "/book"].map(path => ({ url: new URL(path || "/", site.siteUrl!).toString(), lastModified: new Date(), changeFrequency: "monthly" as const, priority: path ? .7 : 1 }));
}
