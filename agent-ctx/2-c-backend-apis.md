# Task 2-c — Backend API Routes (full-stack-developer)

## Summary
Implemented ALL ELC backend API routes per the EXACT contract in worklog.md.

## Files Created (16)
- `src/lib/api-helpers.ts` — shared utilities (`serverError`, `cuid`, `sanitizeFilename`, `isLeadStatus`, etc.)
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/courses/route.ts` (+ `[id]/route.ts`)
- `src/app/api/leads/route.ts` (+ `[id]/route.ts`)
- `src/app/api/testimonials/route.ts` (+ `[id]/route.ts`)
- `src/app/api/teachers/route.ts` (+ `[id]/route.ts`)
- `src/app/api/media/route.ts` (+ `[id]/route.ts`)
- `src/app/api/settings/route.ts`
- `src/app/api/stats/route.ts`

## Key Decisions
- **`cuid()` helper**: `cuid` package isn't installed; implemented as `Date.now().toString(36) + crypto.randomBytes(8).toString('hex')` — collision-safe for media filenames.
- **Media upload**: validates `file.type.startsWith("image/")` and `file.size <= 10MB`; writes Buffer to `path.join(process.cwd(), "public", "uploads", "media", filename)` after `mkdir -p`; stores `url = "/uploads/media/<filename>"`.
- **Media delete**: best-effort `unlink` of `path.join(process.cwd(), "public", media.url)` (ignores missing-file errors), then `db.mediaAsset.delete`.
- **Settings upsert**: whitelisted string fields only; create payload seeded with `DEFAULT_CONTACT` defaults so first PUT works.
- **Stats**: `Promise.all` for 11 parallel queries (6 counts + 4 status counts + recent 5 leads select).
- **Lead PATCH**: validates `status` against `["new","contacted","enrolled","archived"]` whitelist.
- **Courses PATCH**: permissive — accepts partial updates for whitelisted string fields + `featured`/`order`/`active` booleans/numbers.

## Verification (all passed)
- `bun run lint`: 0 errors in my files (only warnings in frontend files I don't own).
- `bunx tsc --noEmit`: 0 errors in my files (errors only in `examples/`, `skills/`, `src/components/landing/pricing.tsx`).
- End-to-end curl tests:
  - Login with correct creds → 200 `{ok, admin}`; wrong creds → 401 `{error:"Credenciales inválidas"}`.
  - `/api/auth/me` → `{authenticated:false}` without cookie, `{authenticated:true, admin:{id,name,email}}` with cookie.
  - Logout → 200 `{ok:true}` + `Set-Cookie: elc_admin=; Expires=1970`.
  - `GET /api/courses` public → 10 active courses; `?featured=1` → 6 featured; admin → all (incl. inactive).
  - `POST /api/courses` → 201 `{course}`; `PATCH` to `active:false` → public view drops it; `DELETE` → `{ok:true}`.
  - `POST /api/leads` (public) → 201 `{ok:true}` (no id exposed); missing name → 400.
  - `GET /api/leads` (admin) → `{leads:[]}` ordered desc; (no auth) → 401.
  - `GET /api/testimonials` / `/api/teachers` → public active-only; admin all.
  - `POST /api/media` (multipart) → 201 `{media:{...url}}` + file written to disk; `DELETE` → file removed + DB row gone.
  - `GET /api/settings` → `{config:{...SiteConfig}}`.
  - `GET /api/stats` (admin) → `{leads, leadsNew, courses, testimonials, teachers, media, byStatus:{...}, recentLeads:[...]}`.

## No Deviations
Contract implemented exactly. Response shapes match what frontend agents expect (arrays wrapped in named keys: `{courses}`, `{leads}`, etc.).

## Notes for Frontend Agents
- All list endpoints return objects with named array keys (NOT bare arrays).
- Admin endpoints return `401 {error:"No autorizado"}` — handle in fetch wrappers.
- Media `url` is relative (e.g. `/uploads/media/xyz.png`) — use directly in `<img src>`.
- Lead PATCH accepts `{status}` and/or other fields; status must be one of new|contacted|enrolled|archived.
