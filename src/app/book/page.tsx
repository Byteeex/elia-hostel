import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BookingOptions } from "@/components/BookingOptions";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata("Book Now | Booking Inquiries", "Explore Elia Hostel's three shared dormitories and private suite in Tangier. Send an honest pre-opening booking inquiry without payment or false confirmation.", "/book");

export default function BookPage() {
  return <main id="main"><section className="page-hero book-hero"><div className="shell"><p className="eyebrow">A PLACE FOR YOU</p><h1>Let&apos;s find your<br /><em>little corner.</em></h1><p className="page-lead">Choose the kind of stay you&apos;re dreaming of. {site.status === "preopening" ? "We're preparing to open, so this is an inquiry about future availability." : "Tell us about your plans, or use our official booking link when available."}</p><div className="status-pill"><span /> {site.status === "preopening" ? "PRE-OPENING · INQUIRIES ONLY" : "BOOKING INQUIRIES"}</div>{site.status === "open" && site.bookingUrl && <a className="button button-dark official-booking" href={site.bookingUrl} target="_blank" rel="noreferrer">Open official booking engine <ArrowUpRight size={17} /></a>}</div></section>
    <section className="book-section section-space"><div className="shell"><div className="booking-intro"><p className="eyebrow">YOUR STAY, YOUR WAY</p><h2>Choose a place<br /><em>to settle in.</em></h2><p>Shared beds are requested per guest. The private suite is requested as a whole accommodation unit. We&apos;ll share prices and availability when confirmed.</p></div><div className="booking-photo"><div><Image src="/images/elia-dorm.jpg" alt="One shared dormitory at Elia Hostel with wooden bunk beds" fill sizes="(max-width: 800px) 90vw, 40vw" /></div><p><strong>Inside Elia</strong><br />A look at one shared dormitory. The layout may differ from the category you choose below.</p></div><Suspense fallback={<p>Loading booking options…</p>}><BookingOptions /></Suspense></div></section>
    <section className="mini-cta"><div className="shell"><span>Want to ask something first?</span><Link href="/contact">Contact us <ArrowUpRight size={17} /></Link></div></section>
  </main>;
}
