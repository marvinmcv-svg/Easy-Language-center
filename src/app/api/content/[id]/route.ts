import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { SECTIONS } from "@/lib/content";

// PUT /api/content/[id]  (admin) — save draft for a section.
// body: { data: {...} }
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const def = SECTIONS.find((s) => s.key === id || s.label === id);
  if (!def) {
    return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
  }
  let body: { data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body.data || typeof body.data !== "object") {
    return NextResponse.json({ error: "Falta 'data'" }, { status: 400 });
  }
  const draftJson = JSON.stringify(body.data);
  const row = await db.siteContent.upsert({
    where: { section: def.key },
    update: { draft: draftJson, label: def.label },
    create: {
      id: def.key,
      section: def.key,
      label: def.label,
      draft: draftJson,
      published: JSON.stringify(def.defaults),
    },
  });
  await logActivity({
    actor: admin.email,
    action: "update",
    entity: "content",
    entityId: def.key,
    summary: `Editó borrador de "${def.label}"`,
  });
  return NextResponse.json({ ok: true, section: row });
}

// POST /api/content/[id]  (admin) — publish the draft (or body.data) to live.
// body optional: { data?: {...} } — if provided, sets draft AND publishes it.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const def = SECTIONS.find((s) => s.key === id || s.label === id);
  if (!def) {
    return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
  }
  let body: { data?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body allowed — publish existing draft */
  }
  const existing = await db.siteContent.findUnique({
    where: { section: def.key },
  });
  const draftJson =
    body.data !== undefined
      ? JSON.stringify(body.data)
      : existing?.draft ?? JSON.stringify(def.defaults);
  const row = await db.siteContent.upsert({
    where: { section: def.key },
    update: { draft: draftJson, published: draftJson, label: def.label },
    create: {
      id: def.key,
      section: def.key,
      label: def.label,
      draft: draftJson,
      published: draftJson,
    },
  });
  await logActivity({
    actor: admin.email,
    action: "publish",
    entity: "content",
    entityId: def.key,
    summary: `Publicó cambios en "${def.label}"`,
  });
  return NextResponse.json({ ok: true, section: row });
}

// POST /api/content/[id]/reset  (admin) — reset a section's draft to published.
// Implemented as DELETE = reset draft to current published.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const def = SECTIONS.find((s) => s.key === id || s.label === id);
  if (!def) {
    return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
  }
  const existing = await db.siteContent.findUnique({
    where: { section: def.key },
  });
  const published = existing?.published ?? JSON.stringify(def.defaults);
  const row = await db.siteContent.upsert({
    where: { section: def.key },
    update: { draft: published },
    create: {
      id: def.key,
      section: def.key,
      label: def.label,
      draft: published,
      published,
    },
  });
  await logActivity({
    actor: admin.email,
    action: "update",
    entity: "content",
    entityId: def.key,
    summary: `Descartó borrador de "${def.label}"`,
  });
  return NextResponse.json({ ok: true, section: row });
}
