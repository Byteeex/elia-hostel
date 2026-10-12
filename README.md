# Elia Hostel website

A Next.js App Router website for Elia Hostel in Tangier's Old Medina. It is configured in **pre-opening inquiry mode**. It does not show prices, availability, or reservation confirmations.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.

## Configure verified business details

Copy `.env.example` to `.env.local` and fill in confirmed values. At minimum, add `NEXT_PUBLIC_CONTACT_EMAIL` or `NEXT_PUBLIC_WHATSAPP_NUMBER` to enable the contact and booking forms. Email forms open the visitor's email application with a prepared message; WhatsApp forms open a prepared chat. The visitor still has to send the message in that application. No information is stored by this site.

- `NEXT_PUBLIC_SITE_URL`: final HTTPS domain for canonicals and sitemap
- `NEXT_PUBLIC_CONTACT_EMAIL`: verified public email
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: verified number, with country code
- `NEXT_PUBLIC_INSTAGRAM_URL`: official profile URL
- `NEXT_PUBLIC_STREET_ADDRESS`: verified street address
- `NEXT_PUBLIC_MAP_LAT` and `NEXT_PUBLIC_MAP_LNG`: verified coordinates; enables the map
- `NEXT_PUBLIC_BOOKING_URL`: reserved for a future external booking engine
- `NEXT_PUBLIC_LOGO_PATH`: optional override for the official header wordmark stored in `public/`

Accommodation definitions and hostel status are in `src/lib/site.ts`. Room descriptions are deliberately modest; verify them alongside actual bed configurations before launch. Prices, amenities, and breakfast options are currently unset. Integrate a PMS or booking engine before accepting real-time reservations or payments.

When Elia opens, change `site.status` to `"open"`. A verified `NEXT_PUBLIC_BOOKING_URL` then exposes a link to the official external booking engine; this site still does not claim availability or process payments itself.

## Imagery

`public/images/elia-dorm.jpg` and `public/images/elia-reception-salon.jpg` are the real photos provided by the hostel. The dorm photo is deliberately presented as one shared dormitory; it is not assigned to a particular 4-bed or 6-bed category. The rooftop and Medina images remain AI-generated illustrative concepts, and room card illustrations are CSS artwork. Replace them with verified photos as those become available.

The official logo comes from `elia logo.pdf`. `public/images/elia-emblem.png` and `public/images/elia-wordmark.png` are direct crops of the original elements for a compact header lockup; `public/images/elia-logo-full.png` is a crop of the complete original logo for the footer. `src/app/icon.png` uses the same emblem as the browser tab icon. The artwork itself was not redrawn or generated.

## 3D experience

First-time homepage visits show an interactive 3D entrance using the real Poly Haven Large Castle Door model. Its two original leaves swing inward independently on their hinge origins while the frame remains stationary; GSAP moves the camera through a modeled plaster-and-tile passage with varied floor plants and low wall vines before revealing the existing homepage. The reception photo is part of the homepage, not a flat backdrop in the 3D passage. Visitors can skip, and reduced-motion visitors can enter without the animation. The entrance is remembered for the current browser session; homepage deep links bypass it. `ASSET_NOTES.md` records the supplied-file naming issue and model provenance.

Use `/?intro=1` to replay the entrance during review, even after entering earlier in the session.

After entering, the homepage defers its scroll-driven React Three Fiber ivy canvas until idle time. Its stem grows down the center of the desktop layout; on narrow screens it moves to the right edge to keep text clear. Clustered branches are merged into one geometry, two textured leaf variations use instancing, and draw ranges limit growth and visible geometry. GSAP ScrollTrigger keeps growth reversible during scrolling.

`src/components/three/quality.ts` defines high, medium, and low presets. Initial quality uses WebGL capability, device memory, processor count, data-saver status, and pointer type; sustained slow active frames reduce quality without automatic oscillation. Mobile keeps real 3D when WebGL is available. The demand-driven renderer caps DPR and pauses when idle. Reduced-motion preferences and unsupported WebGL receive a static botanical fallback. `ASSET_NOTES.md` records the ivy texture source.
