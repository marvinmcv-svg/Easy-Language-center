# CONTENT-WIRE — Wire landing section components to accept content props

**Agent:** full-stack-developer
**Task ID:** CONTENT-WIRE
**Status:** ✅ Complete

## Context
Read previous agents' work in this directory:
- `2-a-landing-page.md` — landing page structure (14 components)
- `2-c-backend-apis.md` — backend API contract

The reference example was `src/components/landing/languages.tsx` (already done) which accepts `content?: LanguagesContent` and uses `content?.eyebrow ?? "default"` pattern.

## Files Updated (10 total)
1. `src/components/landing/courses.tsx` — signature `Courses({ courses, content }: { courses: CourseItem[]; content?: CoursesContent })`. Replaced eyebrow/title/subtitle with `content?.eyebrow ?? "Cursos disponibles"` etc.
2. `src/components/landing/method.tsx` — signature `Method({ content }: { content?: MethodContent })`. Replaced eyebrow/title; `const steps = content?.steps ?? STEPS;` then `steps.map(...)`. Kept `import { STEPS } from "@/lib/brand"` for fallback. Subtitle left hardcoded (MethodContent has no subtitle field).
3. `src/components/landing/features.tsx` — signature `Features({ content }: { content?: FeaturesContent })`. Switched to `import * as Icons from "lucide-react"` + `(Icons as unknown as Record<string, LucideIcon>)[point.icon] ?? Icons.Sparkles` lookup pattern (matches index.tsx StatIcon). `const items = content?.items ?? SELLING_POINTS;`. Subtitle left hardcoded (FeaturesContent has no subtitle field).
4. `src/components/landing/gallery.tsx` — signature `Gallery({ content }: { content?: GalleryContent })`. Replaced eyebrow/title/subtitle. NOTE: current code had eyebrow="Galería"/title="Vida en ELC" which was swapped vs. content schema (DEFAULT_GALLERY.eyebrow="Vida en ELC", title="Galería"). Wired correctly to match schema defaults.
5. `src/components/landing/teachers.tsx` — signature `Teachers({ teachers, content }: { teachers: TeacherItem[]; content?: TeachersContent })`. Replaced eyebrow/title/subtitle. Title fallback uses DEFAULT_TEACHERS.title ("Conoce a tus profesores") — different from previous hardcoded "Profesores que inspiran", aligned to content schema.
6. `src/components/landing/testimonials.tsx` — signature `Testimonials({ testimonials, content }: { testimonials: TestimonialItem[]; content?: TestimonialsContent })`. Replaced eyebrow/title; ADDED subtitle paragraph (`<p className="mt-4 ...">{subtitle}</p>`) since the section previously had no subtitle but TestimonialsContent has one.
7. `src/components/landing/pricing.tsx` — signature `Pricing({ content }: { content?: PricingContent })`. Made `PromoCard.icon` optional. `const promos = content?.promos ?? PROMOS;`. Icon resolution: `promo.icon ?? PROMO_ICONS[i % PROMO_ICONS.length] ?? Sparkles` (PROMO_ICONS=[Zap,Sparkles,Check,User]). Replaced eyebrow/title/subtitle/iaesteNote.
8. `src/components/landing/faq.tsx` — signature `Faq({ content }: { content?: FaqContent })`. `const items = content?.items ?? FAQS;` then `items.map(...)`. Replaced eyebrow/title/subtitle/ctaLabel. Title fallback uses DEFAULT_FAQ.title ("Resolvemos tus dudas") — different from previous hardcoded "¿Tienes dudas?".
9. `src/components/landing/contact.tsx` — Added `eyebrow`, `title`, `subtitle` to `ContactConfig` interface. Component reads `const eyebrow = c.eyebrow ?? "Contacto"`, `c.title ?? "¿Hablamos?"`, `c.subtitle ?? "Escríbenos por WhatsApp..."`. Title was "Empieza hoy mismo" → now "¿Hablamos?" (DEFAULT_CONTACT.title).
10. `src/components/landing/footer.tsx` — Added `tagline` and `description` to `FooterConfig` interface. Component reads `c.tagline ?? "Aprende. Practica. Avanza."` and `c.description ?? "Academia de idiomas en Santa Cruz, Bolivia..."`. Replaced `{BRAND.tagline} Academia de idiomas en {BRAND.city}...` with `{tagline} {description}`. Kept BRAND import for copyright line.

## Key Decisions
- All fallback strings match `DEFAULT_*` constants in `src/lib/content.ts` (the content schema defaults), matching the pattern from `languages.tsx`.
- For `features.tsx`, used the `import * as Icons` namespace pattern (as suggested in the task) so admin can choose any lucide-react icon by name.
- For `pricing.tsx`, content `promos` don't have `icon` field (per PricingContent schema). Resolved by using `PROMO_ICONS[index % 4]` as fallback, so content-driven promos still get a sensible icon.
- TypeScript "best common type" inference correctly unifies `content.promos` shape with `PromoCard[]` (since PromoCard has all-optional extras), so `promo.icon` access is type-safe.
- Added a subtitle paragraph to `testimonials.tsx` (was missing) to honor TestimonialsContent.subtitle.

## Verification
- `bun run lint`: ✅ 0 errors.
- `npx tsc --noEmit`: ✅ 0 errors in any src/components/landing/* file. (Pre-existing errors only: `src/components/brand/flag.tsx`, `examples/*`, `skills/*` — none touched by this task.)
- `dev.log`: No compile errors attributed to these edits. (Dev server PID was not alive at time of check; system auto-manages `bun run dev`.)

## Notes for Downstream Agents
- All 10 components now have `content?: XContent` (or extend their existing config interface) and gracefully fall back to defaults when `content` is undefined. This means the components work standalone (e.g., in storybook or unit tests) without requiring content props.
- `ContactConfig` and `FooterConfig` interfaces are now supersets of the old shape — existing callers that pass the old shape (without eyebrow/title/subtitle/tagline/description) will get `undefined` for those fields, and the component falls back to defaults via `??`. So no breaking change to existing call sites.
- The `index.tsx` server component already passes `content.{section}` to every section and the contact/footer configs are built from `content.contact` and `content.footer` — verified by reading `src/components/landing/index.tsx`.
