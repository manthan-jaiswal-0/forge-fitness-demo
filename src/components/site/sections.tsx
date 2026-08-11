import {
  Check,
  Clock,
  Dumbbell,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  ArrowRight,
} from "lucide-react";

import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import mapImage from "@/assets/map.jpg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/section";
import { DemoBadge } from "@/components/demo-badge";
import {
  faqs,
  gym,
  memberships,
  openingHours,
  programs,
  testimonials,
  trainers,
} from "@/lib/demo-data";
import { useTrialDialog } from "@/lib/trial-dialog";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <Section id="about">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading
            eyebrow="About the gym"
            title="A training floor, not a showroom"
            description="Forge Fitness is built around coaching. Every member starts with an induction, gets a written plan, and trains under the eye of a coach who knows their name."
          />
          <ul className="mt-8 space-y-4">
            {[
              "Technique-first coaching for every experience level",
              "Small groups so nobody trains unsupervised",
              "Programs written in blocks, reviewed every month",
              "Early-morning and late-evening slots for city schedules",
            ].map((point) => (
              <li key={point} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img
            src={gallery1}
            alt="Chalked barbell loaded with plates"
            width={1000}
            height={1000}
            loading="lazy"
            className="aspect-square w-full rounded-lg object-cover"
          />
          <img
            src={gallery2}
            alt="Functional training turf with kettlebells and ropes"
            width={1000}
            height={1000}
            loading="lazy"
            className="mt-8 aspect-square w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </Section>
  );
}

export function Programs() {
  const { openTrial } = useTrialDialog();
  return (
    <Section id="programs" muted>
      <SectionHeading
        eyebrow="Programs"
        title="Pick the way you want to train"
        description="Six coached formats, all included in the free trial. Not sure which fits? Tell us your goal and we will suggest one."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.id} className="border-border bg-card/80 transition-colors hover:border-primary/50">
            <CardHeader className="space-y-3">
              <Dumbbell className="size-6 text-primary" aria-hidden="true" />
              <CardTitle className="text-xl text-display">{program.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {program.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                  {program.duration}
                </span>
                <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                  {program.level}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button variant="hero" size="lg" className="mt-8 w-full sm:w-auto" onClick={openTrial}>
        Try any program free <ArrowRight aria-hidden="true" />
      </Button>
    </Section>
  );
}

export function Memberships() {
  const { openTrial } = useTrialDialog();
  return (
    <Section id="memberships">
      <SectionHeading
        eyebrow="Memberships"
        title="Simple plans, no lock-in games"
        description="Illustrative demo pricing. A real gym would set its own plans — the layout stays the same."
        align="center"
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {memberships.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col border-border bg-card/80",
              plan.featured && "border-primary/60 shadow-ember",
            )}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ember px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-primary-foreground">
                Most popular
              </span>
            ) : null}
            <CardHeader>
              <CardTitle className="text-xl text-display">{plan.name}</CardTitle>
              <p className="mt-2">
                <span className="text-4xl text-display text-primary">{plan.price}</span>
                <span className="ml-2 text-sm text-muted-foreground">{plan.period}</span>
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-6">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.featured ? "hero" : "outlineLight"}
                size="lg"
                className="w-full"
                onClick={openTrial}
              >
                Start with a free trial
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Demo pricing shown in INR for illustration only.
      </p>
    </Section>
  );
}

export function Trainers() {
  return (
    <Section id="trainers" muted>
      <SectionHeading
        eyebrow="Coaches"
        title="Coached by people, not apps"
        description="Fictional coach profiles created for this demo — no real individuals are represented."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trainers.map((trainer) => (
          <Card key={trainer.id} className="border-border bg-card/80 text-center">
            <CardContent className="pt-6">
              <span
                aria-hidden="true"
                className="mx-auto flex size-20 items-center justify-center rounded-full bg-ember text-2xl text-display text-primary-foreground"
              >
                {trainer.initials}
              </span>
              <h3 className="mt-4 text-lg text-display">{trainer.name}</h3>
              <p className="mt-1 text-sm text-primary">{trainer.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{trainer.focus}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

const galleryImages = [
  { src: gallery1, alt: "Loaded barbell close-up" },
  { src: gallery2, alt: "Turf area with kettlebells and battle ropes" },
  { src: gallery3, alt: "Cardio machines facing a city skyline at dusk" },
  { src: gallery4, alt: "Mirrored group studio with a wooden floor" },
];

export function Gallery() {
  return (
    <Section id="gallery">
      <SectionHeading eyebrow="The space" title="Inside the forge" />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {galleryImages.map((image, index) => (
          <img
            key={image.alt}
            src={image.src}
            alt={image.alt}
            width={1000}
            height={1000}
            loading="lazy"
            className={cn(
              "aspect-square w-full rounded-lg object-cover",
              index === 0 && "md:col-span-2 md:aspect-[2/1]",
              index === 3 && "md:col-span-2 md:aspect-[2/1]",
            )}
          />
        ))}
      </div>
    </Section>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials" muted>
      <SectionHeading
        eyebrow="Member voices"
        title="What training here feels like"
        description="Illustrative quotes written for this demo. Real testimonials would replace them before launch."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <Card key={item.id} className="border-border bg-card/80">
            <CardContent className="space-y-4 pt-6">
              <Quote className="size-6 text-primary" aria-hidden="true" />
              <blockquote className="text-sm leading-relaxed text-foreground">
                “{item.quote}”
              </blockquote>
              <footer className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{item.author}</span> ·{" "}
                {item.program}
              </footer>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <DemoBadge /> <span className="text-xs text-muted-foreground">Sample content</span>
      </div>
    </Section>
  );
}

export function HoursAndLocation() {
  return (
    <Section id="location">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Opening hours"
            title="Open before work, open after"
          />
          <dl className="mt-8 divide-y divide-border rounded-lg border border-border bg-card/60">
            {openingHours.map((row) => (
              <div key={row.day} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <dt className="text-sm font-medium">{row.day}</dt>
                <dd className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4 text-primary" aria-hidden="true" />
                  {row.hours}
                </dd>
              </div>
            ))}
          </dl>

          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <SectionHeading eyebrow="Find us" title="Lower Parel, Mumbai" />
          <div className="mt-8 overflow-hidden rounded-lg border border-border">
            <img
              src={mapImage}
              alt="Stylised map showing the demo gym location"
              width={1200}
              height={800}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="flex flex-col gap-3 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <address className="text-sm not-italic text-muted-foreground">
                <span className="block font-medium text-foreground">{gym.name}</span>
                {gym.address.line1}, {gym.address.line2}, {gym.address.city}
              </address>
              <Button variant="outlineLight" size="sm" disabled className="shrink-0">
                <MapPin aria-hidden="true" /> Directions (demo)
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Map is an illustration. The production build embeds a live Google Maps location.
          </p>
        </div>
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" muted>
      <SectionHeading
        eyebrow="Contact"
        title="Talk to the front desk"
        description="Demo contact details — these numbers and addresses are not live."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Phone, label: "Call", value: gym.phoneDisplay, href: gym.phoneHref },
          { icon: MessageCircle, label: "WhatsApp", value: "Message the desk", href: gym.whatsapp },
          { icon: Mail, label: "Email", value: gym.email, href: `mailto:${gym.email}` },
        ].map((item) => (
          <Card key={item.label} className="border-border bg-card/80">
            <CardContent className="flex items-start gap-4 pt-6">
              <item.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <a
                  href={item.href}
                  className="mt-1 block break-words text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.value}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function FinalCta() {
  const { openTrial } = useTrialDialog();
  return (
    <Section className="pb-20">
      <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-8 text-center shadow-panel md:p-14">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-30 blur-3xl"
          style={{ backgroundImage: "var(--gradient-ember)" }}
          aria-hidden="true"
        />
        <p className="eyebrow relative">First session on us</p>
        <h2 className="relative mt-3 text-3xl text-display sm:text-5xl">
          Come train once. Then decide.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
          Book a free trial session and a coach will walk you through the floor, your goal and the
          program that fits it.
        </p>
        <Button
          variant="hero"
          size="lg"
          onClick={openTrial}
          className="relative mt-8 w-full sm:w-auto"
        >
          Book free trial <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </Section>
  );
}
