import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/demo-badge";
import { gym } from "@/lib/demo-data";
import { useTrialDialog } from "@/lib/trial-dialog";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#memberships", label: "Memberships" },
  { href: "#trainers", label: "Trainers" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const { openTrial } = useTrialDialog();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-border bg-background/95 backdrop-blur"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 md:h-18 md:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-ember">
            <Flame className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-display text-lg leading-none">
            {gym.shortName}
            <span className="block text-[0.6rem] font-normal tracking-[0.3em] text-muted-foreground">
              Mumbai
            </span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outlineLight"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link to="/demo-admin">Demo dashboard</Link>
          </Button>
          <Button variant="hero" size="sm" onClick={openTrial} className="hidden sm:inline-flex">
            Book free trial
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Menu className="hidden" /> : null}
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-5 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-md px-2 text-base font-medium text-foreground hover:bg-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/demo-admin"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center gap-2 rounded-md px-2 text-base font-medium text-foreground hover:bg-accent"
                >
                  Dashboard <DemoBadge />
                </Link>
              </li>
            </ul>
            <Button
              variant="hero"
              size="lg"
              className="mt-3 w-full"
              onClick={() => {
                setOpen(false);
                openTrial();
              }}
            >
              Book free trial
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
