import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Camera, Mail, MapPin } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";

export function SiteFooter() {
  const wa = whatsappUrl("Hello Elia, I would like to ask about staying with you.");
  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div className="footer-intro"><Image src={site.fullLogoPath} alt="Elia Hostel official logo" width={165} height={193} className="footer-logo" /><p>A little place to feel at home, tucked inside Tangier&apos;s Old Medina.</p><div className="footer-location"><MapPin size={15} /> {site.location}</div></div>
      <div><h2>Explore</h2><Link href="/">Home</Link><Link href="/about">About Us</Link><Link href="/why-elia">Why Elia</Link><Link href="/book">Booking inquiries</Link></div>
      <div><h2>Say hello</h2><Link href="/contact">Contact us <ArrowUpRight size={14} /></Link>{site.email && <a href={`mailto:${site.email}`}><Mail size={14} /> {site.email}</a>}{wa && <a href={wa} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} /></a>}{site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer"><Camera size={14} /> Instagram</a>}</div>
      <div className="footer-mark" aria-hidden="true">E<span>✦</span></div>
    </div>
    <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Elia Hostel</span><span>Made for slow mornings and curious days.</span><span>Rooftop and Medina imagery is illustrative.</span></div>
  </footer>;
}
