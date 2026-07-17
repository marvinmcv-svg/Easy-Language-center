# Easy Learning Center

Website and admin portal for **Easy Learning Center (ELC)** — a language school in
Santa Cruz, Bolivia. A public marketing landing page plus a self-service admin
CMS that lets a non-technical owner manage every piece of site content, courses,
teachers, testimonials, media, and leads.

## Stack

- **Next.js 16** (App Router, Turbopack, `output: "standalone"`)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (Radix) components
- **Prisma 6** ORM with **SQLite** (swappable to PostgreSQL)
- **Bun** as the package manager / runtime
- Cookie-based admin auth (HMAC-signed session, scrypt password hashing)

## Features

**Public site** (`/`) — 14 sections: hero, languages, courses (filterable),
method, features, gallery (lightbox), teachers, testimonials (carousel),
pricing, FAQ, contact form (creates leads), footer, plus a WhatsApp CTA and the
"Shirley" AI chat widget.

**Admin portal** (`/admin`) — dashboard (KPIs + activity feed), leads CRM,
courses, teachers, testimonials, media library, a structured content editor with
**draft / publish**, site settings, a ⌘K command palette, and CSV lead export.

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.3
- Node.js ≥ 20 (for some tooling)

## Getting started

The defaults in `.env.example` work out of the box for local dev.

**macOS / Linux:**

```bash
cp .env.example .env
bun run setup          # install + prisma generate + db push + seed
bun run dev            # http://localhost:3000
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
bun run setup
bun run dev            # http://localhost:3000
```

That's it — open http://localhost:3000. If `localhost` refuses to connect,
the dev server isn't running: come back to this terminal and re-run
`bun run dev`.

### Admin login

After seeding, sign in at `/admin` with:

- **Email:** `admin@easylearning.com`
- **Password:** `elc-admin-2026`

Change these before going live by setting `ADMIN_EMAIL` / `ADMIN_PASSWORD` /
`ADMIN_NAME` in `.env` and re-running the seed (or update the record via the
admin UI / a Prisma script).

## Environment variables

See [`.env.example`](.env.example). Summary:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Prisma datasource URL. |
| `AUTH_SECRET` | **in production** | Signs admin session cookies. The app refuses to start in production if this is unset or left at the dev default. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | no | Override the seeded admin (seed script only). |
| `ANTHROPIC_API_KEY` | no | Reserved for wiring the chat widget to an AI provider. |

### Database URL

Prisma resolves a relative SQLite `file:` path against the `prisma/` directory,
and the standalone production server runs from a different working directory, so
an **absolute path** is the most predictable choice:

```
DATABASE_URL="file:/absolute/path/to/Easy-Language-center/db/custom.db"
```

To use **PostgreSQL** instead, change the datasource `provider` in
`prisma/schema.prisma` to `postgresql`, set a `postgres://…` URL, then run
`bun run db:push` and re-seed.

## Production build

```bash
# Requires AUTH_SECRET to be set.
AUTH_SECRET="$(openssl rand -hex 32)" bun run build

# Run the standalone server
NODE_ENV=production AUTH_SECRET="…" DATABASE_URL="…" bun run start
```

`bun run build` produces a self-contained server at `.next/standalone/server.js`
(with `public/` and static assets copied in). Deploy the `.next/standalone`
directory behind any reverse proxy.

**SQLite note:** the database file must live on a persistent, writable volume in
production. For ephemeral/serverless hosts, use PostgreSQL instead.

## AI chat ("Shirley")

The chat widget calls `POST /api/chat`. It attempts to use an AI provider and,
if none is configured/available, replies with a warm fallback that points users
to WhatsApp — so the widget always works without crashing. To enable a real AI
backend, implement `generateReply()` in `src/app/api/chat/route.ts`.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Dev server on port 3000 |
| `bun run build` | Production build (standalone) |
| `bun run start` | Run the built standalone server |
| `bun run lint` | ESLint |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:push` | Push schema to the database |
| `bun run scripts/seed.ts` | Seed initial data |

## Project structure

```
src/
  app/            App Router pages + API routes
    api/          REST endpoints (auth, courses, leads, content, media, …)
    admin/        Admin portal page
  components/
    landing/      Public landing-page sections
    admin/        Admin portal UI
    ui/           shadcn/ui primitives
    brand/        Logo, flags, chat + WhatsApp widgets
  lib/            db, auth, content schema, helpers
prisma/           schema.prisma
scripts/seed.ts   Database seed
public/uploads/   Site images (gallery, hero, logo)
```
