import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: site.siteUrl ? new URL(site.siteUrl) : undefined,
  title: { default: "Elia Hostel | A Little Place to Feel at Home in Tangier", template: "%s | Elia Hostel" },
  description: "Discover Elia Hostel, a warm boutique-style hostel preparing to welcome travelers in Tangier's Old Medina, Morocco.",
  openGraph: { siteName: "Elia Hostel", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
