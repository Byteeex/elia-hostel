import { assetPath } from "@/lib/assets";

export type Room = {
  id: string;
  name: string;
  shortName: string;
  category: "bed" | "unit";
  capacity: number;
  description: string;
  note: string;
  art: string;
};

const optional = (value?: string) => value?.trim() || undefined;

export const site = {
  name: "Elia Hostel",
  status: "preopening" as "preopening" | "open",
  location: "Tangier Old Medina, Morocco",
  email: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  whatsapp: optional(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  instagram: optional(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  streetAddress: optional(process.env.NEXT_PUBLIC_STREET_ADDRESS),
  bookingUrl: optional(process.env.NEXT_PUBLIC_BOOKING_URL),
  logoPath: optional(process.env.NEXT_PUBLIC_LOGO_PATH) || assetPath("/images/elia-wordmark.png"),
  emblemPath: assetPath("/images/elia-emblem.png"),
  fullLogoPath: assetPath("/images/elia-logo-full.png"),
  siteUrl: optional(process.env.NEXT_PUBLIC_SITE_URL),
  mapLat: optional(process.env.NEXT_PUBLIC_MAP_LAT),
  mapLng: optional(process.env.NEXT_PUBLIC_MAP_LNG),
  breakfast: undefined as string | undefined,
  amenities: [] as string[],
  prices: {} as Record<string, number>,
  propertyPhotos: [assetPath("/images/elia-reception-salon.jpg"), assetPath("/images/elia-dorm.jpg")],
};

export const rooms: Room[] = [
  {
    id: "female-six",
    name: "6-bed female-only shared dormitory",
    shortName: "The Female Dorm",
    category: "bed",
    capacity: 6,
    description: "A shared space for women finding their rhythm in Tangier.",
    note: "Book an individual bed · 6 beds in the room",
    art: "female",
  },
  {
    id: "male-six",
    name: "6-bed male-only shared dormitory",
    shortName: "The Six-Bed Dorm",
    category: "bed",
    capacity: 6,
    description: "An easygoing shared room to come back to after a day out.",
    note: "Book an individual bed · 6 beds in the room",
    art: "male-six",
  },
  {
    id: "male-four",
    name: "4-bed male-only shared dormitory",
    shortName: "The Four-Bed Dorm",
    category: "bed",
    capacity: 4,
    description: "A smaller shared setting, with room to slow down.",
    note: "Book an individual bed · 4 beds in the room",
    art: "male-four",
  },
  {
    id: "suite",
    name: "Private suite",
    shortName: "The Private Suite",
    category: "unit",
    capacity: 4,
    description: "A private place to settle in, with a little more space of your own.",
    note: "One king-sized bed · two smaller beds · small salon · private bathroom",
    art: "suite",
  },
];

export function absoluteUrl(path: string) {
  return site.siteUrl ? new URL(path, site.siteUrl).toString() : undefined;
}

export function whatsappUrl(message: string) {
  const digits = site.whatsapp?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : undefined;
}
