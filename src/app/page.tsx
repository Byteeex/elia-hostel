import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Heart, MapPin, Sun, UsersRound } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { RoomArt } from "@/components/RoomArt";
import { IvyExperience } from "@/components/ivy/IvyExperience";
import { EntranceExperience } from "@/components/entrance/EntranceExperience";
import { rooms, site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Hostel in Tangier's Old Medina", "Elia Hostel is a warm little place preparing to welcome travelers in Tangier's Old Medina. Explore rooms, our story, and booking inquiries.", "/");

export default function HomePage() {
  return <main id="main" className="home-page" tabIndex={-1}>
    <EntranceExperience />
    <IvyExperience />
    <section className="hero" id="hero">
      <div className="hero-image"><Image src="/images/elia-reception-salon.jpg" alt="The reception salon at Elia Hostel, with a sofa, arched wooden doorway, and woven pendant light" fill priority sizes="(max-width: 600px) 100vw, 50vw" /></div>
      <div className="hero-wash" />
      <div className="shell hero-content">
        <p className="eyebrow light"><span className="eyebrow-line" /> WELCOME TO ELIA HOSTEL · TANGIER</p>
        <h1>Your Little<br /><em>Corner</em><br />of Tangier<span className="period">.</span></h1>
        <p className="hero-subtitle">Tucked inside Tangier&apos;s Old Medina, Elia is a cozy little hostel made for curious travelers, slow mornings, and the joy of discovering somewhere new.</p>
        <div className="hero-actions"><Link href="#rooms" className="button button-cream">Explore our rooms <ArrowUpRight size={17} /></Link><Link href="/about" className="text-link light-link">Discover Elia <ArrowRight size={17} /></Link></div>
      </div>
      <div className="hero-bottom shell"><span className="hero-side-note">A little place to feel at home</span><a href="#welcome" className="scroll-cue">SCROLL TO EXPLORE <ArrowDown size={16} /></a><span className="image-credit">ELIA HOSTEL · RECEPTION SALON</span></div>
    </section>

    <section className="welcome section-space" id="welcome"><div className="shell welcome-grid">
      <Reveal className="welcome-art-wrap"><div className="welcome-art"><div className="welcome-photo"><Image src="/images/elia-dorm.jpg" alt="A shared dormitory at Elia Hostel with wooden bunks and a woven pendant light" fill sizes="(max-width: 800px) 90vw, 42vw" /></div><div className="welcome-stamp">a little<br />more<br /><em>at home</em><Asterisk size={24} /></div></div><p className="art-caption">01 / Inside a shared dormitory at Elia</p></Reveal>
      <Reveal className="welcome-copy"><p className="eyebrow">HELLO, WE&apos;RE ELIA</p><h2>A Little Place<br />to Feel <em>at Home.</em></h2><div className="small-rule" /><p className="lead">Somewhere between the winding streets and the open sky, there&apos;s room to slow down.</p><p>Elia is an independent, intimate hostel taking shape in Tangier&apos;s Old Medina. A place for new stories, familiar comforts, and the simple pleasure of being somewhere that feels like yours for a while.</p><Link href="/about" className="text-link">Get to know us <ArrowUpRight size={18} /></Link></Reveal>
    </div></section>

    <section className="rooms-section section-space" id="rooms"><div className="shell">
      <Reveal className="section-heading rooms-heading"><div><p className="eyebrow">STAY A WHILE</p><h2>Find Your<br /><em>Little Corner.</em></h2></div><p>Shared stories or a space of your own. Find the stay that feels right for your Tangier days.</p></Reveal>
      <Reveal className="rooms-feature"><div className="rooms-feature-image"><Image src="/images/elia-dorm.jpg" alt="One of Elia Hostel's shared dormitories, showing built-in bunks, wooden ladders, and tiled floor" fill sizes="(max-width: 800px) 90vw, 42vw" /></div><div className="rooms-feature-copy"><p className="eyebrow">A REAL LOOK INSIDE ELIA</p><h3>Rest, then<br /><em>go explore.</em></h3><p>Inside one of our shared dormitories. The photo gives a feel for the space; layouts may differ between room categories.</p></div></Reveal>
      <div className="rooms-grid">{rooms.map((room, index) => <Reveal className="room-card" key={room.id}><Link href={`/book?room=${room.id}`} className="room-card-link" aria-label={`Inquire about ${room.name}`}><div className="room-image"><RoomArt variant={room.art} /><span className="room-index">0{index + 1} / 04</span><span className="room-arrow"><ArrowUpRight size={24} strokeWidth={1.5} /></span></div><div className="room-info"><div><span className="room-type">{room.category === "bed" ? "SHARED DORMITORY · PER BED" : "PRIVATE ACCOMMODATION · WHOLE SUITE"}</span><h3>{room.shortName}</h3><p>{room.description}</p></div><span className="room-discover">View & inquire <ArrowRight size={16} /></span></div></Link></Reveal>)}</div>
      <p className="rooms-note">Elia is preparing to open. Availability and prices will be shared directly when confirmed.</p>
    </div></section>

    <section className="why-section section-space" id="why"><div className="shell why-grid"><Reveal><p className="eyebrow light">THE ELIA FEELING</p><h2>Some Places You Visit.<br /><em>Others Stay With You.</em></h2><p>Elia is imagined as a little pause in the beautiful bustle of Tangier: creative, calm, and full of heart.</p><Link href="/why-elia" className="button button-outline-light">Why Elia? <ArrowUpRight size={17} /></Link></Reveal><div className="why-points"><Reveal><span className="why-number">01</span><MapPin size={25} strokeWidth={1.4} /><h3>In the Old Medina</h3><p>Step into Tangier&apos;s layered streets, atmosphere, and everyday life.</p></Reveal><Reveal><span className="why-number">02</span><Heart size={25} strokeWidth={1.4} /><h3>Small by nature</h3><p>An intimate setting with space to settle in and feel at ease.</p></Reveal><Reveal><span className="why-number">03</span><Sun size={25} strokeWidth={1.4} /><h3>Room to slow down</h3><p>Thoughtful corners and a rooftop made for unhurried moments.</p></Reveal></div></div></section>

    <section className="moments-section section-space" id="experience"><div className="shell"><Reveal className="moments-heading"><p className="eyebrow">THE ELIA EXPERIENCE</p><h2>It&apos;s in the<br /><em>little moments.</em></h2><p>There is a quiet beauty in the details of a place. Take a first look inside Elia as we prepare to open.</p></Reveal><div className="moments-grid"><Reveal className="moment moment-photo"><Image src="/images/elia-reception-salon.jpg" alt="The reception salon at Elia Hostel, with a white sofa and Moroccan tile floor" fill sizes="(max-width: 700px) 90vw, 50vw" /><span>01 · A place to pause</span></Reveal><Reveal className="moment moment-illustration"><Image src="/images/elia-dorm.jpg" alt="A shared dormitory at Elia Hostel with wooden bunks" fill sizes="(max-width: 700px) 90vw, 28vw" /><span>02 · A good night&apos;s rest</span></Reveal><Reveal className="moment moment-type"><Asterisk size={50} strokeWidth={1} /><p>Slow mornings.<br /><em>New stories.</em><br />Open doors.</p><span>03 · THIS IS THE ELIA FEELING</span></Reveal></div><p className="illustration-note">Photographs show Elia&apos;s reception salon and a shared dormitory.</p></div></section>

    <section className="rooftop-section" id="rooftop"><div className="rooftop-image"><Image src="/images/tangier-rooftop-concept.png" alt="Illustrative Tangier rooftop courtyard scene" fill sizes="100vw" /></div><div className="rooftop-overlay" /><div className="shell rooftop-content"><Reveal><p className="eyebrow light">ABOVE THE MEDINA</p><h2>A Little Closer<br /><em>to the Sky.</em></h2><p>Imagine a quieter moment above the rhythm of the streets. A coffee, a conversation, a little space to take it all in.</p><Link href="/why-elia" className="button button-cream">The Elia experience <ArrowUpRight size={17} /></Link></Reveal></div><span className="rooftop-credit">ILLUSTRATIVE CONCEPT IMAGE</span></section>

    <section className="tangier-section section-space" id="tangier"><div className="shell tangier-grid"><Reveal className="tangier-copy"><p className="eyebrow">TANGIER, AT YOUR DOORSTEP</p><h2>Find Us in the Heart<br />of the <em>Old Medina.</em></h2><p className="lead">A city of winding lanes, layered cultures, sea air, and unexpected discoveries.</p><p>Elia&apos;s place in the Old Medina invites you to wander, get curious, and let Tangier reveal itself one turn at a time.</p><div className="location-badge"><MapPin size={20} /><div><strong>Old Medina</strong><span>Tangier, Morocco</span></div></div><Link href="/contact" className="text-link">Find your way to Elia <ArrowUpRight size={18} /></Link></Reveal><Reveal className="tangier-visual"><div className="tangier-photo"><Image src="/images/medina-lane-concept.png" alt="Illustrative concept of an Old Medina lane in Tangier" fill sizes="(max-width: 800px) 90vw, 42vw" /><span>TANGER <i>·</i> MOROCCO</span></div><p className="art-caption">The old city, endlessly new · concept imagery</p></Reveal></div></section>

    <section className="final-cta section-space" id="inquire"><div className="shell final-inner"><Reveal><p className="eyebrow">YOUR NEXT CHAPTER</p><h2>Your Tangier Story<br /><em>Starts Here.</em></h2><p>{site.status === "preopening" ? "We're preparing to welcome our first guests. Tell us what you have in mind, and we'll be in touch when we can share more." : "Come find your little corner in Tangier."}</p><Link href="/book" className="button button-dark">Make a booking inquiry <ArrowUpRight size={18} /></Link><span className="final-small"><UsersRound size={15} /> An inquiry is not a confirmed reservation.</span></Reveal><div className="final-decoration" aria-hidden="true"><span>e</span><div className="final-sun" /></div></div></section>
  </main>;
}
