import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/lib/site-config";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/site/hero";
import {
  About,
  Contact,
  FinalCta,
  Gallery,
  HoursAndLocation,
  Memberships,
  Programs,
  Testimonials,
  Trainers,
} from "@/components/site/sections";

const title = "Forge Fitness Mumbai — Coach-led strength training (demo)";
const description =
  "Demo website for a fictional Mumbai strength & conditioning gym: programs, memberships, coaches and a free trial request flow.";
const url = `${siteConfig.url}/`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ExerciseGym",
          name: siteConfig.name,
          description: siteConfig.intro,
          url,
          telephone: siteConfig.phoneDisplay,
          email: siteConfig.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
            addressLocality: "Mumbai",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Programs />
        <Memberships />
        <Trainers />
        <Gallery />
        <Testimonials />
        <HoursAndLocation />
        <Contact />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
