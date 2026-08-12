# Forge Fitness Mumbai — Gym Growth Platform (DEMO)

A polished, **fictional** demo of the Gym Growth Platform, built to pitch real gyms in Mumbai.
Everything you see — the gym, its coaches, prices, reviews, contact details and leads — is invented
sample content. Nothing here is a live business, and no real personal data is used.

## What the demo shows

**1. Marketing website (`/`)**
Hero with a Book Free Trial CTA, About, Programs, Memberships, Trainers, Gallery, Testimonials,
Opening Hours + FAQ, Location, Contact and a closing CTA. Mobile-first, dark "forge" design system,
restrained motion, keyboard accessible.

**2. Conversion flow**
Clicking any **Book Free Trial** button opens a validated enquiry form (name, phone, email, fitness
goal, preferred training type, preferred time, optional message) and finishes on a success state with
a reference number.

**3. Demo dashboard (`/demo-admin`)**
The business value of the platform: KPI cards (total leads / new / trials booked / joined), a searchable
and filterable lead table, a lead detail panel with status changes and notes, and a follow-up view with
overdue flagging. Enquiries submitted on the website appear here immediately.

> Demo state lives in React context in the browser. Reloading the page resets it, and a
> "Reset demo data" button restores the seeded mock leads.

## Tech

React 19 · TypeScript · TanStack Start (Router + Query) · Tailwind CSS v4 · shadcn/ui · lucide-react

## Project structure

```
src/
  assets/                  generated imagery (hero, gallery, map)
  components/
    demo-badge.tsx         reusable "Demo" labelling
    site/                  marketing site: header, footer, hero, sections, trial dialog
    ui/                    shadcn primitives
  lib/
    demo-data.ts           fictional gym content (programs, plans, coaches, hours…)
    leads.ts               Lead model, statuses, mock leads, helpers
    leads-store.tsx        client-side lead store (React context)
    trial-dialog.tsx       global Book Free Trial dialog provider
  routes/
    __root.tsx             shell, fonts, providers
    index.tsx              marketing website
    demo-admin.tsx         demo admin dashboard
  styles.css               design system tokens (oklch) + utilities
```

All colours, gradients and shadows are semantic tokens in `src/styles.css`. Components never hardcode
colours, so the whole template can be rebranded per gym by editing tokens and `demo-data.ts`.

## Explicitly not implemented (by design, this stage)

No Supabase / database, no authentication, no Power Automate, no AI, no email or WhatsApp sending,
no payments, no analytics. The demo is purely visual and functional.

## How this evolves into production

| Area | Demo today | Production next |
| --- | --- | --- |
| Lead capture | Form writes to browser context | Server function → Postgres `leads` table |
| Lead storage | `mockLeads` array | Database with row-level security per gym |
| Admin access | Public `/demo-admin` route | Authenticated staff area with roles (owner / staff) |
| Notifications | None | WhatsApp/SMS/email alert to the gym on each new lead |
| Automation | None | Follow-up reminders and status-based workflows |
| Content | `demo-data.ts` | Per-gym CMS content, images and branding |
| Multi-tenant | Single fictional gym | One template, many gyms with their own tokens and domain |
| Analytics | KPI cards from mock data | Real conversion reporting: enquiry → trial → member |

Because the data layer is isolated behind `leads-store.tsx` and `demo-data.ts`, swapping mock data for
real backend calls will not require rewriting the UI.

## Running locally

```bash
bun install
bun run dev
```

## Backend direction

The frontend is written against a service layer (`src/lib/leads-api.ts`), not a transport.
Trial requests resolve locally today; the production path is:

React → REST → FastAPI → PostgreSQL

Swapping the body of `submitLead` for a `POST /api/leads` request is the only change required.
Business-specific values (name, phone, WhatsApp number, email, address, URL) live in
`src/lib/site-config.ts` so the template can be re-skinned per gym.
