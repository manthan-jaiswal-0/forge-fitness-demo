import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";

import { gym } from "@/lib/demo-data";
import { whatsappLink, whatsappDefaultMessage } from "@/lib/site-config";
import { DemoBadge } from "@/components/demo-badge";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-ember">
              <Flame className="size-4 text-primary-foreground" aria-hidden="true" />
            </span>
            <span className="text-display text-lg">{gym.shortName}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{gym.intro}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Visit</h3>
          <address className="mt-3 space-y-1 text-sm not-italic text-muted-foreground">
            <p>{gym.address.line1}</p>
            <p>{gym.address.line2}</p>
            <p>{gym.address.city}</p>
            <p>
              <a className="hover:text-foreground" href={gym.phoneHref}>
                {gym.phoneDisplay}
              </a>
            </p>
            <p>
              <a className="hover:text-foreground" href={`mailto:${gym.email}`}>
                {gym.email}
              </a>
            </p>
            <p>
              <a
                className="hover:text-foreground"
                href={whatsappLink(whatsappDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Demo</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            This is a fictional pitch demo of the Gym Growth Platform. Business name, coaches,
            reviews, prices and contact details are invented.
          </p>
          <Link
            to="/demo-admin"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Open the demo dashboard <DemoBadge />
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground md:px-8">
          © {new Date().getFullYear()} {gym.name} (fictional). Demo build — not a live business.
        </p>
      </div>
    </footer>
  );
}
