import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Info } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { RoomArt } from "@/components/RoomArt";
import { pageMetadata } from "@/lib/metadata";
import { rooms, site } from "@/lib/site";

export const metadata = pageMetadata("Book Now | Booking Inquiries", "Explore Elia Hostel's three shared dormitories and private suite in Tangier. Send an honest pre-opening booking inquiry without payment or false confirmation.", "/book");

export default async function BookPage({ searchParams }: { searchParams: Promise<{ room?: string }> }) {
  const params = await searchParams;
  const selected = rooms.some(room => room.id === params.room) ? params.room : undefined;
  return <main id="main"><section className="page-hero book-hero"><div className="shell"><p className="eyebrow">A PLACE FOR YOU</p><h1>Let&apos;s find your<br /><em>little corner.</em></h1><p className="page-lead">Choose the kind of stay you&apos;re dreaming of. {site.status === "preopening" ? "We're preparing to open, so this is an inquiry about future availability." : "Tell us about your plans, or use our official booking link when available."}</p><div className="status-pill"><span /> {site.status === "preopening" ? "PRE-OPENING · INQUIRIES ONLY" : "BOOKING INQUIRIES"}</div>{site.status === "open" && site.bookingUrl && <a className="button button-dark official-booking" href={site.bookingUrl} target="_blank" rel="noreferrer">Open official booking engine <ArrowUpRight size={17} /></a>}</div></section>
    <section className="book-section section-space"><div className="shell"><div className="booking-intro"><p className="eyebrow">YOUR STAY, YOUR WAY</p><h2>Choose a place<br /><em>to settle in.</em></h2><p>Shared beds are requested per guest. The private suite is requested as a whole accommodation unit. We&apos;ll share prices and availability when confirmed.</p></div><div className="booking-photo"><div><Image src="/images/elia-dorm.jpg" alt="One shared dormitory at Elia Hostel with wooden bunk beds" fill sizes="(max-width: 800px) 90vw, 40vw" /></div><p><strong>Inside Elia</strong><br />A look at one shared dormitory. The layout may differ from the category you choose below.</p></div><div className="booking-options">{rooms.map((room, index) => <Link key={room.id} href={`/book?room=${room.id}#inquiry-form`} className={`booking-option ${selected === room.id ? "selected" : ""}`} aria-current={selected === room.id ? "true" : undefined}><div className="booking-option-art"><RoomArt variant={room.art} /></div><div className="booking-option-info"><span>0{index + 1} / {room.category === "bed" ? "INDIVIDUAL BED" : "PRIVATE UNIT"}</span><h3>{room.shortName}</h3><p>{room.note}</p></div><ArrowUpRight size={21} /></Link>)}</div>
      <div className="booking-form-layout" id="inquiry-form"><div className="booking-aside"><CalendarDays size={35} strokeWidth={1.2} /><p className="eyebrow">YOUR PLANS</p><h2>Tell us when<br /><em>you&apos;d like to come.</em></h2><p>We&apos;re not taking confirmed reservations or payments yet. Your message helps us understand what you&apos;re looking for.</p><div className="booking-assurance"><Info size={19} /><span>No live availability or price is being shown. We&apos;ll reply when we can share verified details.</span></div></div><div className="form-panel"><h2>Booking inquiry</h2><p className="form-intro">Share your preferred dates and accommodation. This does not hold a room or bed.</p><Suspense fallback={<p>Loading form…</p>}><InquiryForm key={selected || "none"} kind="booking" initialRoom={selected} /></Suspense></div></div></div></section>
    <section className="mini-cta"><div className="shell"><span>Want to ask something first?</span><Link href="/contact">Contact us <ArrowUpRight size={17} /></Link></div></section>
  </main>;
}
