import { ArrowRight, Star } from "lucide-react";

import heroImage from "@/assets/hero-gym.jpg";
import { Button } from "@/components/ui/button";
import { gym, stats } from "@/lib/demo-data";
import { useTrialDialog } from "@/lib/trial-dialog";

export function Hero() {
  const { openTrial } = useTrialDialog();

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <img
        src={heroImage}
        alt="Weights and benches on the training floor at Forge Fitness Mumbai"
        width={1600}
        height={1104}
        className="absolute inset-0 size-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--gradient-veil)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[92svh] w-full max-w-6xl flex-col justify-end px-5 pb-14 pt-28 md:px-8 md:pb-20">
        <p className="eyebrow">Lower Parel · Mumbai</p>
        <h1 className="mt-4 max-w-3xl text-4xl text-display sm:text-6xl md:text-7xl">
          Strength is built,
          <span className="block text-primary">not bought.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Coach-led strength and conditioning in the heart of the city. Structured programs,
          small groups and a floor built for serious training — whatever your starting point.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="hero" size="lg" onClick={openTrial} className="sm:w-auto">
            Book free trial <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="outlineLight" size="lg" asChild>
            <a href="#programs">See programs</a>
          </Button>
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
          Free trial session · No card required · {gym.phoneDisplay}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-border/60 pt-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl text-display text-primary md:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground md:text-sm">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
