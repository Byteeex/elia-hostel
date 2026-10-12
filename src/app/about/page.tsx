import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { assetPath } from "@/lib/assets";

export const metadata = pageMetadata("About Us", "Meet Elia Hostel: an intimate, creative little place taking shape in Tangier's Old Medina, with a warm welcome at its heart.", "/about");

export default function AboutPage() {
  return <main id="main"><section className="page-hero about-hero"><div className="shell page-hero-grid"><div><p className="eyebrow">OUR STORY, JUST BEGINNING</p><h1>Made for the<br /><em>feeling of home.</em></h1><p className="page-lead">A little place in a city that stays with you. Elia is taking shape with a simple idea: make room for travelers to feel welcome, curious, and completely themselves.</p></div><div className="page-hero-art">  <Image src={assetPath("/images/elia-reception-salon.jpg")} alt="The reception salon at Elia Hostel, with an arched wooden doorway and white sofa" fill sizes="(max-width: 800px) 90vw, 42vw" /><span>ELIA / RECEPTION SALON</span></div></div></section>
    <section className="section-space story-section"><div className="shell editorial-grid"><Reveal><p className="eyebrow">A LITTLE PLACE, A BIG FEELING</p><h2>Arrive as you are.<br /><em>Stay a little longer.</em></h2></Reveal><Reveal><p className="lead">The best places give you room to make your own memories.</p><p>Elia&apos;s vision is an intimate home base for Tangier: warm materials, thoughtful corners, plants finding their way toward the light, and a sense that you can slow down here.</p><p>We&apos;re still preparing to open. The details of the space will be shared as they become real, but the spirit is already clear: welcoming, creative, and rooted in the Old Medina.</p></Reveal></div></section>
    <section className="about-values section-space"><div className="shell"><Reveal className="center-heading"><Asterisk size={32} strokeWidth={1} /><p className="eyebrow">WHAT GUIDES US</p><h2>Small things, <em>beautifully felt.</em></h2></Reveal><div className="value-grid"><Reveal><span>01</span><h3>Come together</h3><p>Shared accommodation invites new connections and stories worth taking home.</p></Reveal><Reveal><span>02</span><h3>Find your quiet</h3><p>There is always value in a pause, a corner to read, or a moment above the Medina.</p></Reveal><Reveal><span>03</span><h3>Stay curious</h3><p>Tangier rewards wandering. We hope Elia feels like the beginning of that discovery.</p></Reveal></div></div></section>
    <section className="page-cta"><div className="shell"><p className="eyebrow light">THE STORY CONTINUES</p><h2>Come be part<br />of <em>what&apos;s next.</em></h2><Link href="/book" className="button button-cream">Make an inquiry <ArrowUpRight size={18} /></Link></div></section>
  </main>;
}
