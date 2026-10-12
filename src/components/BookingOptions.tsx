"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Info } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { RoomArt } from "@/components/RoomArt";
import { rooms } from "@/lib/site";

export function BookingOptions() {
  const params = useSearchParams();
  const roomParam = params.get("room");
  const selected = roomParam && rooms.some(room => room.id === roomParam) ? roomParam : undefined;

  return <><div className="booking-options">{rooms.map((room, index) => <Link key={room.id} href={`/book?room=${room.id}#inquiry-form`} className={`booking-option ${selected === room.id ? "selected" : ""}`} aria-current={selected === room.id ? "true" : undefined}><div className="booking-option-art"><RoomArt variant={room.art} /></div><div className="booking-option-info"><span>0{index + 1} / {room.category === "bed" ? "INDIVIDUAL BED" : "PRIVATE UNIT"}</span><h3>{room.shortName}</h3><p>{room.note}</p></div><ArrowUpRight size={21} /></Link>)}</div>
    <div className="booking-form-layout" id="inquiry-form"><div className="booking-aside"><CalendarDays size={35} strokeWidth={1.2} /><p className="eyebrow">YOUR PLANS</p><h2>Tell us when<br /><em>you&apos;d like to come.</em></h2><p>We&apos;re not taking confirmed reservations or payments yet. Your message helps us understand what you&apos;re looking for.</p><div className="booking-assurance"><Info size={19} /><span>No live availability or price is being shown. We&apos;ll reply when we can share verified details.</span></div></div><div className="form-panel"><h2>Booking inquiry</h2><p className="form-intro">Share your preferred dates and accommodation. This does not hold a room or bed.</p><InquiryForm key={selected || "none"} kind="booking" initialRoom={selected} /></div></div></>;
}
