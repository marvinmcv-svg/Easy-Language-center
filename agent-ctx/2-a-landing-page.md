# Task 2-a — Landing Page Agent — Work Record

## Identity
- Task ID: 2-a
- Agent: full-stack-developer (landing page)
- Scope: Build the ELC public landing page (all 14 sections + assembly in `src/components/landing/`).

## Files Created / Modified
All in `/home/z/my-project/src/components/landing/`:
- `index.tsx` — SERVER component (no "use client"). Entry point. Fetches data from Prisma via `db`, assembles the full page with sticky footer.
- `navbar.tsx` (client)
- `hero.tsx` (client)
- `languages.tsx` (client)
- `courses.tsx` (client — filter tabs)
- `method.tsx` (client)
- `features.tsx` (client)
- `gallery.tsx` (client — lightbox)
- `teachers.tsx` (client)
- `testimonials.tsx` (client — carousel)
- `pricing.tsx` (client)
- `faq.tsx` (client — accordion)
- `contact.tsx` (client — form)
- `footer.tsx` (server)

## Key Decisions
1. Only `index.tsx` is a server component. All other sections are client islands that receive already-fetched data as serializable props (Date fields excluded via Prisma `select`).
2. `export const dynamic = "force-dynamic"` is set on `index.tsx` so data is always fresh (matches the page.tsx decision).
3. Inline sections (Stats bar, CTA banner) live directly in `index.tsx` since they're static and don't need their own file.
4. Brand colors strictly used (navy/red/gold/cream). NO indigo/blue-500 Tailwind defaults.
5. Sticky footer pattern: `<div className="flex min-h-screen flex-col"><main className="flex-1">…</main><footer className="mt-auto">…</footer></div>`.
6. Section IDs: #inicio, #idiomas, #cursos, #metodo, #galeria, #profesores, #testimonios, #precios, #faq, #contacto. All have `elc-section` class for scroll-margin-top:90px (clears fixed navbar).

## Exported Types (reusable by other tasks)
- `HeroConfig` from `hero.tsx`
- `CourseItem` from `courses.tsx`
- `TestimonialItem` from `testimonials.tsx`
- `TeacherItem` from `teachers.tsx`
- `ContactConfig` from `contact.tsx`
- `FooterConfig` from `footer.tsx`

## API Contract Used
- `POST /api/leads` with JSON `{name, phone, email?, courseInterest?, message?}`. Expects `{ok:true}` on 201 or `{error:string}` on 4xx.
- All WhatsApp CTAs use `whatsappLink(config.whatsapp ?? DEFAULT_CONTACT.whatsapp, <prefilled text>)`.

## Validation
- `bun run lint`: 0 errors in landing files (only admin/*.tsx unused eslint-disable warnings remain — not mine).
- `npx tsc --noEmit`: 0 errors in `src/components/landing/*` (only unrelated errors in `examples/` and `skills/`).
- Dev server: `GET / 200 in 226ms` with all Prisma queries (Course/Testimonial/Teacher/SiteConfig) running successfully.

## Notes for Task 2-b / 2-c
- Landing page reads `db.siteConfig.findUnique({where:{id:"singleton"}})` directly — seed must populate this (defaults to DEFAULT_CONTACT otherwise).
- Course cards reference `course.image` (URL string) — should resolve to `/uploads/gallery/...` or `/uploads/media/...` paths.
- Teacher avatars: when `image` is null/empty, an initial-letter avatar fallback is rendered.
- Hero collage uses 4 GALLERY images selected by `tag`/`language` (resolves to existing seed images).
- Contact form includes `courseInterest` values: language codes (english/italian/portuguese/french/german/spanish) + "exam-prep" + "counseling" + "general".
