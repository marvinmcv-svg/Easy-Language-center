# ACTIVITY-CSV — full-stack-developer (activity logging + leads CSV export)

## Task
- Part A: Add `logActivity(...)` calls to existing API routes (login, courses, leads, testimonials, teachers, media, settings).
- Part B: Create `GET /api/leads/export` returning a CSV file (admin-only).

## Work Log
- Read worklog.md, src/lib/activity.ts (`logActivity`, fire-and-forget, self-catching), src/lib/auth.ts (`requireAdmin` returns `session | null`, fields: id, email, name, exp).
- Read all 9 existing route files before editing to understand exact structure (admin var name, response shape, where the DB write happens).
- Added `import { logActivity } from "@/lib/activity";` and a `logActivity({...})` call AFTER each successful DB write, BEFORE the `NextResponse.json(...)` return, on every handler:
  - `src/app/api/auth/login/route.ts` — on successful login: `{actor: admin.email, action:"login", entity:"auth", summary:"Inició sesión"}`. (Did NOT log on failed creds.)
  - `src/app/api/courses/route.ts` — POST: `{actor, action:"create", entity:"course", entityId: course.id, summary:"Creó curso '${course.title}'"}`.
  - `src/app/api/courses/[id]/route.ts` — PATCH: `{... action:"update", entityId:id, summary:"Actualizó curso"}`. DELETE: `{... action:"delete", summary:"Eliminó curso"}`.
  - `src/app/api/leads/route.ts` — POST is PUBLIC (no admin). SKIPPED per task instructions. GET (admin list) also skipped (read-only, no actor action worth logging).
  - `src/app/api/leads/[id]/route.ts` — PATCH: `{... action:"update", entity:"lead", entityId:id, summary:"Actualizó lead (estado)"}`. DELETE: `{... action:"delete", summary:"Eliminó lead"}`.
  - `src/app/api/testimonials/route.ts` — POST: `{... entity:"testimonial", entityId:testimonial.id, summary:"Creó testimonio de '${testimonial.name}'"}`.
  - `src/app/api/testimonials/[id]/route.ts` — PATCH: `{... summary:"Actualizó testimonio"}`. DELETE: `{... summary:"Eliminó testimonio"}`.
  - `src/app/api/teachers/route.ts` — POST: `{... entity:"teacher", entityId:teacher.id, summary:"Creó profesor '${teacher.name}'"}`.
  - `src/app/api/teachers/[id]/route.ts` — PATCH: `{... summary:"Actualizó profesor"}`. DELETE: `{... summary:"Eliminó profesor"}`.
  - `src/app/api/media/route.ts` — POST upload: `{... entity:"media", entityId:media.id, summary:"Subió '${media.filename}'"}`.
  - `src/app/api/media/[id]/route.ts` — DELETE: `{... summary:"Eliminó recurso de media"}`.
  - `src/app/api/settings/route.ts` — PUT: `{... entity:"settings", summary:"Actualizó configuración del sitio"}`.
- All logActivity calls use `admin.email` as `actor` (the admin session object returned by `requireAdmin` includes `email`). Did NOT change response shapes or status codes — only added the log calls + import.
- Created `src/app/api/leads/export/route.ts`:
  - GET handler, admin-only (`requireAdmin` → 401 JSON `{error:"No autorizado"}` if unauthenticated).
  - Fetches all leads via `db.lead.findMany({ orderBy: { createdAt: "desc" } })`.
  - Builds CSV with headers `Nombre,Telefono,Email,Interes,Mensaje,Estado,FechaCreacion` and one row per lead.
  - `escapeCsv()` helper wraps every value in double quotes and doubles any internal `"` (RFC 4180 compliant). Null/undefined → `""`. `FechaCreacion` rendered as ISO 8601 string.
  - Rows joined with `\r\n` (Windows-style line endings, Excel-friendly).
  - Returns `new Response(csvBody, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="leads-elc.csv"' } })`.
  - Note: Next.js prefers static routes over dynamic ones, so `/api/leads/export` resolves to `export/route.ts` and NOT to `/api/leads/[id]` — verified by HTTP 200 + CSV body returned.

## Verification
- `bun run lint`: 0 errors, 0 warnings.
- `bunx tsc --noEmit`: 0 errors in any of the edited/created files.
- Smoke-tested end-to-end with curl (started a temp dev server):
  - `POST /api/auth/login` (admin@easylearning.com) → 200 `{ok:true, admin:{...}}`.
  - `GET /api/leads/export` (with cookie) → 200 with headers `content-type: text/csv; charset=utf-8` + `content-disposition: attachment; filename="leads-elc.csv"`. Body contained the header row + one lead row, all properly escaped.
  - `PATCH /api/leads/{id}` (with cookie, `{status:"contacted"}`) → 200, lead updated.
  - Queried `db.activityLog.findMany()` directly via bun script — confirmed 3 entries written: 2× login ("Inició sesión") + 1× update lead ("Actualizó lead (estado)") with correct actor/summary/entityId. Logging works end-to-end.
- Killed my temp dev server afterward so the auto-managed dev server can take over.

## Stage Summary
- Files EDITED (9): `api/auth/login/route.ts`, `api/courses/route.ts`, `api/courses/[id]/route.ts`, `api/leads/[id]/route.ts`, `api/testimonials/route.ts`, `api/testimonials/[id]/route.ts`, `api/teachers/route.ts`, `api/teachers/[id]/route.ts`, `api/media/route.ts`, `api/media/[id]/route.ts`, `api/settings/route.ts`. (That's 11 files actually, but each only got the import + 1-3 logActivity calls — no behavioral change.)
- Files CREATED (1): `src/app/api/leads/export/route.ts` (CSV export, ~60 lines).
- Activity logging is now wired across all admin write operations (login + CRUD on courses/leads/testimonials/teachers/media/settings). Public lead POST intentionally NOT logged (no admin actor).
- CSV export endpoint available at `GET /api/leads/export` (admin cookie required). Frontend agents can add an "Exportar CSV" button in the admin leads manager that does `fetch("/api/leads/export")` and triggers a download via the `Content-Disposition: attachment` header.
