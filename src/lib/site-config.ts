/**
 * Single source of truth for business-specific values.
 * Swapping these (plus the imagery) re-skins the template for another gym.
 * Fictional demo details — not a live business.
 */

export const siteConfig = {
  name: "Forge Fitness Mumbai",
  shortName: "Forge Fitness",
  tagline: "Strength is built, not bought.",
  intro:
    "A fictional strength & conditioning studio in Lower Parel, created to demonstrate the Gym Growth Platform.",
  url: (import.meta.env["VITE_SITE_URL"] as string | undefined) ?? "http://localhost:3000",
  phoneDisplay: "+91 90000 00000",
  phoneHref: "tel:+919000000000",
  /** Digits only, international format — used to build wa.me links. */
  whatsappNumber: "919000000000",
  email: "hello@forgefitness.demo",
  address: {
    line1: "Unit 4, Mill Works Compound",
    line2: "Senapati Bapat Marg, Lower Parel",
    city: "Mumbai 400013",
  },
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
} as const;

/** Build a WhatsApp deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const whatsappDefaultMessage = `Hi ${siteConfig.shortName}, I'd like to know more about training here.`;
