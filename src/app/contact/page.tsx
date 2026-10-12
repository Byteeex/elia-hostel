import Link from "next/link";
import { ArrowUpRight, Camera, Mail, MapPin, MessageCircle } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { pageMetadata } from "@/lib/metadata";
import { site, whatsappUrl } from "@/lib/site";

export const metadata = pageMetadata("Contact Us", "Get in touch with Elia Hostel about our Tangier Old Medina location, opening plans, accommodation, and future stays.", "/contact");

export default function ContactPage() {
  const wa = whatsappUrl("Hello Elia, I have a question about the hostel.");
  const coordinates = site.mapLat && site.mapLng ? `${site.mapLat},${site.mapLng}` : undefined;
  return <main id="main"><section className="page-hero contact-hero"><div className="shell"><p className="eyebrow">SAY HELLO</p><h1>Every good story<br />starts with <em>hello.</em></h1><p className="page-lead">Have a question about Elia, Tangier, or a future stay? We&apos;d love to hear from you.</p></div></section>
    <section className="contact-section section-space"><div className="shell contact-grid"><div className="contact-details"><p className="eyebrow">FIND YOUR WAY</p><h2>A little note<br /><em>from you to us.</em></h2><p>Elia is preparing to open in Tangier&apos;s Old Medina. Confirmed details will appear here as they become available.</p><div className="contact-method"><MapPin size={22} /><div><strong>Find us</strong><span>{site.streetAddress || site.location}</span></div></div>{site.email && <a className="contact-method" href={`mailto:${site.email}`}><Mail size={22} /><div><strong>Write to us</strong><span>{site.email}</span></div><ArrowUpRight size={18} /></a>}{wa && <a className="contact-method" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={22} /><div><strong>WhatsApp</strong><span>Start a conversation</span></div><ArrowUpRight size={18} /></a>}{site.instagram && <a className="contact-method" href={site.instagram} target="_blank" rel="noreferrer"><Camera size={22} /><div><strong>Instagram</strong><span>Find us there</span></div><ArrowUpRight size={18} /></a>}{!site.email && !wa && <p className="contact-unavailable">Our contact channels will appear here as soon as they are confirmed.</p>}</div><div className="form-panel"><p className="eyebrow">DROP US A LINE</p><h2>Send an inquiry</h2><InquiryForm kind="contact" /></div></div></section>
    {coordinates && <section className="map-section"><iframe title="Map of Elia Hostel" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(coordinates)}&output=embed`} /><a href={`https://www.google.com/maps?q=${encodeURIComponent(coordinates)}`} target="_blank" rel="noreferrer">Open in maps <ArrowUpRight size={16} /></a></section>}
    <section className="mini-cta"><div className="shell"><span>Looking for a place to stay?</span><Link href="/book">Explore accommodation <ArrowUpRight size={17} /></Link></div></section>
  </main>;
}
