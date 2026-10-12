"use client";

import { useState } from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { rooms, site, whatsappUrl } from "@/lib/site";

type FormKind = "contact" | "booking";

export function InquiryForm({ kind, initialRoom }: { kind: FormKind; initialRoom?: string }) {
  const [roomId, setRoomId] = useState(initialRoom || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const room = rooms.find(item => item.id === roomId);
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  const canDeliver = Boolean(site.email || site.whatsapp);

  const composeMessage = () => [
    kind === "booking" ? "Booking inquiry — not a confirmed reservation" : "General inquiry",
    `Name: ${name}`,
    `Reply email: ${email}`,
    ...(kind === "booking" ? [`Accommodation: ${room?.name || "Please advise"}`, `Booking type: ${room?.category === "unit" ? "Private suite as one unit" : "Individual dorm beds"}`, `Guests: ${guests}`, `Preferred check-in: ${checkIn}`, `Preferred check-out: ${checkOut}`] : []),
    `Message: ${message || "—"}`,
  ].join("\n");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (kind === "booking" && (!checkIn || !checkOut || checkOut <= checkIn)) { setNotice("Choose a check-out date after your check-in date."); return; }
    if (room && guests > room.capacity) { setNotice(`This option accommodates up to ${room.capacity} guest${room.capacity === 1 ? "" : "s"}.`); return; }
    if (!canDeliver) { setNotice("Online inquiries are not yet configured. Please check back soon."); return; }
    const body = composeMessage();
    if (site.email) {
      const subject = kind === "booking" ? "Elia Hostel booking inquiry" : "Elia Hostel contact inquiry";
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setNotice("Your email app should open with a prepared message. Please send it there to complete your inquiry. No reservation has been made.");
    } else {
      const url = whatsappUrl(body);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      setNotice("WhatsApp should open with your message. Please send it there to complete your inquiry. No reservation has been made.");
    }
  }

  return <form className="inquiry-form" onSubmit={onSubmit}>
    <div className="form-row"><label>Your name <span>*</span><input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" /></label><label>Email address <span>*</span><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label></div>
    {kind === "booking" && <><label>Accommodation <span>*</span><select required value={roomId} onChange={e => { setRoomId(e.target.value); setGuests(1); }}><option value="">Choose your accommodation</option>{rooms.map(item => <option value={item.id} key={item.id}>{item.name} — {item.category === "bed" ? "per bed" : "whole suite"}</option>)}</select></label>
      {room && <p className="selection-note">{room.category === "bed" ? "You are inquiring about individual beds in a shared dormitory." : "You are inquiring about the entire private suite."} Availability has not been confirmed.</p>}
      <div className="form-row"><label>Preferred check-in <span>*</span><input required type="date" min={today} value={checkIn} onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }} /></label><label>Preferred check-out <span>*</span><input required type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></label></div>
      <label>Number of guests <span>*</span><input required type="number" min={1} max={room?.capacity || 20} value={guests} onChange={e => setGuests(Number(e.target.value))} /></label></>}
    <label>{kind === "booking" ? "Anything we should know?" : "Your message"} <span>{kind === "contact" ? "*" : ""}</span><textarea required={kind === "contact"} rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder={kind === "booking" ? "Tell us a little about your plans…" : "How can we help?"} /></label>
    {!canDeliver && <p className="form-warning">The inquiry form will become available when Elia adds a verified contact email or WhatsApp number.</p>}
    <button type="submit" className="button button-dark" disabled={!canDeliver}>{site.email ? <Mail size={17} /> : <MessageCircle size={17} />} {kind === "booking" ? "Prepare booking inquiry" : "Prepare message"} <ArrowUpRight size={17} /></button>
    <p className="form-disclaimer">{canDeliver ? "Submitting opens your email app or WhatsApp. Your inquiry is sent only after you send it there." : "No message can be delivered until contact details are configured."} {kind === "booking" && "An inquiry does not confirm a reservation or request payment."}</p>
    {notice && <p className="form-notice" role="status">{notice}</p>}
  </form>;
}
