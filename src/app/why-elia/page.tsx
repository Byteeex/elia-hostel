import Link from "next/link";
import { ArrowUpRight, ChevronDown, MapPin, Heart, BedDouble, Sun, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Why Elia Hostel", "Discover Elia's Old Medina setting, intimate atmosphere, shared dormitories, private suite, and rooftop vision in Tangier.", "/why-elia");

const reasons = [
  { icon: MapPin, title: "In the heart of it all", body: "Our home is in Tangier's Old Medina, where every turn offers a new detail to notice and a new route to explore." },
  { icon: Heart, title: "Intentionally intimate", body: "Elia is an independent hostel shaped around a warm, personal atmosphere and the simple comfort of feeling welcome." },
  { icon: BedDouble, title: "A stay that fits", body: "Choose an individual bed in one of three shared dormitories, or make the private suite your own." },
  { icon: Sun, title: "Space to pause", body: "A rooftop is part of Elia's vision: a place for a quiet moment, a conversation, and a different view of the city." },
];

const faqs = [
  ["Is Elia Hostel open yet?", "Elia is currently preparing to open. You can inquire about a future stay, but dates and availability are not confirmed yet."],
  ["Can I reserve one bed in a dormitory?", "Yes. Dormitory inquiries are for individual beds. The private suite is inquired about as one private unit."],
  ["What accommodation options are planned?", "There is a 6-bed female-only dormitory, a 6-bed male-only dormitory, a 4-bed male-only dormitory, and a private suite with one king-sized bed, two smaller beds, a small salon, and a private bathroom."],
  ["Where is Elia located?", "Elia is in Tangier's Old Medina, Morocco. An exact street address and map will be added when confirmed."],
  ["Are prices and availability shown online?", "No. Prices and live availability have not been configured. An inquiry is not a reservation confirmation."],
];

export default function WhyEliaPage() {
  return <main id="main"><section className="page-hero why-hero"><div className="shell"><p className="eyebrow light">THE ELIA FEELING</p><h1>A little different.<br /><em>A lot like home.</em></h1><p className="page-lead">For the traveler who wants more than a place to put down a bag.</p></div><div className="why-hero-shape" aria-hidden="true">✳</div></section>
    <section className="section-space"><div className="shell"><Reveal className="section-heading"><div><p className="eyebrow">WHY STAY WITH US</p><h2>Room for <em>your kind</em><br />of journey.</h2></div><p>Elia brings together the charm of the Medina and the comfort of a small, thoughtful home base.</p></Reveal><div className="reason-grid">{reasons.map(({ icon: Icon, title, body }, i) => <Reveal className="reason" key={title}><span className="reason-index">0{i + 1}</span><Icon size={29} strokeWidth={1.3} /><h3>{title}</h3><p>{body}</p></Reveal>)}</div></div></section>
    <section className="quote-section"><div className="shell"><Sparkles size={28} strokeWidth={1.2} /><blockquote>“A little place to feel at home.”</blockquote><p>THE IDEA BEHIND ELIA</p></div></section>
    <section className="faq-section section-space"><div className="shell faq-grid"><Reveal><p className="eyebrow">GOOD TO KNOW</p><h2>A few things<br /><em>you might ask.</em></h2><p>We&apos;ll keep these answers up to date as opening plans are confirmed.</p><Link href="/contact" className="text-link">Ask us a question <ArrowUpRight size={17} /></Link></Reveal><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></div></section>
    <section className="page-cta"><div className="shell"><p className="eyebrow light">COME AS YOU ARE</p><h2>Find your <em>little corner.</em></h2><Link href="/book" className="button button-cream">Explore your stay <ArrowUpRight size={18} /></Link></div></section>
  </main>;
}
