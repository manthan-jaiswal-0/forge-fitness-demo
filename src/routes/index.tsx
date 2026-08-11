import { createFileRoute } from "@tanstack/react-router";

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
  "Demo website for a fictional Mumbai strength & conditioning gym: programs, memberships, coaches and a free trial booking flow.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
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
