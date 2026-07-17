import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Cuerpo de petición inválido" },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    const allowed: Record<string, string> = {
      language: "string",
      title: "string",
      level: "string",
      type: "string",
      schedule: "string",
      description: "string",
      price: "string",
      priceNote: "string",
      image: "string",
      badge: "string",
    };
    for (const key of Object.keys(allowed)) {
      if (key in data) {
        const v = data[key];
        if (v === null || typeof v === allowed[key]) {
          update[key] = v;
        }
      }
    }
    if ("featured" in data) update.featured = Boolean(data.featured);
    if ("order" in data && typeof data.order === "number")
      update.order = data.order;
    if ("active" in data) update.active = Boolean(data.active);

    const course = await db.course.update({
      where: { id },
      data: update,
    });
    logActivity({
      actor: admin.email,
      action: "update",
      entity: "course",
      entityId: id,
      summary: "Actualizó curso",
    });
    return NextResponse.json({ course });
  } catch (err) {
    return serverError(err, "courses/update");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;

    await db.course.delete({ where: { id } });
    logActivity({
      actor: admin.email,
      action: "delete",
      entity: "course",
      entityId: id,
      summary: "Eliminó curso",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err, "courses/delete");
  }
}
