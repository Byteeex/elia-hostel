"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const links = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/why-elia", "Why Elia"],
  ["/contact", "Contact"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link href="/" className="wordmark" aria-label="Elia Hostel home">
          {site.logoPath ? <span className="brand-lockup"><Image src={site.emblemPath} alt="" width={64} height={64} className="brand-emblem" /><Image src={site.logoPath} alt="" width={150} height={53} className="brand-logo" /></span> : <><span>elia<span className="brand-dot">.</span></span><small>HOSTEL · TANGIER</small></>}
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </nav>
        <Link href="/book" className="header-book">Book now <ArrowUpRight size={16} strokeWidth={1.8} /></Link>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <nav id="mobile-menu" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label="Mobile navigation" inert={!open}>
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        <Link href="/book" className="button button-dark" onClick={() => setOpen(false)}>Make an inquiry <ArrowUpRight size={17} /></Link>
      </nav>
    </header>
  );
}
