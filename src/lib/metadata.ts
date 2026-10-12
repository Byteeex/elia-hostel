import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";
import { assetPath } from "./assets";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: `${title} | Elia Hostel`,
      description,
      url: canonical,
      siteName: site.name,
      type: "website",
      images: site.siteUrl ? [{ url: assetPath("/images/elia-reception-salon.jpg"), alt: "Reception salon at Elia Hostel" }] : undefined,
    },
  };
}
