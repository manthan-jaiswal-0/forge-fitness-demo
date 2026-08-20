# Forge Fitness Mumbai — Gym Growth Platform

A production-grade vertical slice of the **Gym Growth Platform**: a reusable template that turns a gym website into a lead-capture and management system.

Forge Fitness Mumbai is the first (fictional) gym. All names, coaches, prices and contact details are invented demo content.

## Architecture

```
React + TypeScript (TanStack Start)
        │
        ▼
  REST API (fetch)
        │
        ▼
  FastAPI + Pydantic
        │
        ▼
  PostgreSQL (SQLAlchemy)
```

**End-to-end flow:**
Website → Book Free Trial form → `POST /api/leads` → PostgreSQL → Authenticated admin dashboard → Persistent lead management

## What it includes

**1. Marketing website (`/`)**
Hero, About, Programs, Memberships, Trainers, Gallery, Testimonials, FAQ, Location, Contact.
Mobile-first dark design system, keyboard accessible.

**2. Lead capture**
"Book Free Trial" opens a validated form (name, phone, optional email, goal, program, time, message).
Submits to `POST /api/leads` → saved to PostgreSQL → success state with reference number.

**3. Admin login (`/admin-login`)**
Session-based authentication (HTTP-only cookies). Credentials checked against Argon2 password hash.

**4. Lead dashboard (`/demo-admin`)**
Protected route — redirects to login if unauthenticated. KPI cards, searchable/filterable lead table,
lead detail panel with status changes, follow-up tracking. Logout button. Data persists across
refreshes and server restarts.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, TanStack Start (Router + Query), Tailwind CSS v4, shadcn/ui, lucide-react |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy, Argon2 (password hashing), Starlette SessionMiddleware |
| Database | PostgreSQL |
| Build | Vite 8, Nitro (SSR) |

## Project structure

```
src/
  assets/                  imagery (hero, gallery, map)
  components/
    site/                  marketing site: header, footer, hero, sections, trial dialog
    ui/                    shadcn primitives
  lib/
    auth-api.ts            login/logout/me API client
    leads-api.ts           public lead submission API client
    leads-admin-api.ts     authenticated lead management API client
    leads-store.tsx        React context wrapping the admin API
    leads.ts               Lead model, statuses, helpers
    demo-data.ts           fictional gym content (programs, plans, coaches, hours)
    site-config.ts         business-specific values (name, phone, address, URLs)
    trial-dialog.tsx       global Book Free Trial dialog provider
  routes/
    __root.tsx             shell, fonts, providers
    index.tsx              marketing website
    admin-login.tsx        admin login page
    demo-admin.tsx         authenticated admin dashboard
  styles.css               design system tokens (oklch) + utilities

backend/
  app/
    main.py                FastAPI app — CORS, session, routers, startup
    config.py              pydantic-settings — reads .env
    database.py            SQLAlchemy engine + session factory
    models.py              Gym, Lead, LeadNote, AdminUser
    schemas.py             Pydantic request/response models
    dependencies.py        DB session + auth dependencies
    id_gen.py              Sequential LD-XXXX ID generator
    init_db.py             create_all + seed gym & admin user
    routers/
      auth.py              login, logout, me
      leads.py             POST (public), GET/PATCH (authenticated)
  requirements.txt
  .env.example
```

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Health check |
| `POST` | `/api/leads` | No | Submit lead (booking form) |
| `GET` | `/api/leads` | Yes | List leads (paginated, filterable) |
| `GET` | `/api/leads/{id}` | Yes | Full lead detail + notes |
| `PATCH` | `/api/leads/{id}` | Yes | Update status / fields |
| `POST` | `/api/auth/login` | No | Login → session cookie |
| `POST` | `/api/auth/logout` | No | Clear session |
| `GET` | `/api/auth/me` | Yes | Current user info |

## Running locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL (running on localhost:5432)

### Database setup

Create a database named `forge_fitness`:

```sql
CREATE DATABASE forge_fitness;
```

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and a random SECRET_KEY
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

On first start, the backend auto-creates tables and seeds a default admin user.

### Frontend

```bash
cp .env.example .env
# .env.example is pre-configured for localhost
npm install
npm run dev
```

### Default admin credentials

- **Email:** `admin@forgefitness.demo`
- **Password:** `changeme`

## Rebranding for another gym

Business-specific values live in `src/lib/site-config.ts` and `src/lib/demo-data.ts`.
All colours are semantic tokens in `src/styles.css`. Editing these files re-skins the template
without touching components.

## Database schema

Multi-tenant extensible — `gyms` table with `gym_id` foreign key on `leads`:

```
gyms (id, name, created_at)
  └── leads (id, gym_id, name, phone, email, goal, training_type, status, ...)
        └── lead_notes (id, lead_id, author, body, created_at)
  └── admin_users (id, gym_id, email, password_hash)
```
