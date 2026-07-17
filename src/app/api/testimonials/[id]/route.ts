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
    const allowedStrings = ["name", "role", "content", "image"];
    for (const key of allowedStrings) {
      if (key in data) {
        const v = data[key];
        if (v === null || typeof v === "string") update[key] = v;
      }
    }
    if ("rating" in data && typeof data.rating === "number") {
      update.rating = data.rating;
    }
    if ("order" in data && typeof data.order === "number") {
      update.order = data.order;
    }
    if ("active" in data) update.active = Boolean(data.active);

    const testimonial = await db.testimonial.update({
      where: { id },
      data: update,
    });
    logActivity({
      actor: admin.email,
      action: "update",
      entity: "testimonial",
      entityId: id,
      summary: "Actualizó testimonio",
    });
    return NextResponse.json({ testimonial });
  } catch (err) {
    return serverError(err, "testimonials/update");
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

    await db.testimonial.delete({ where: { id } });
    logActivity({
      actor: admin.email,
      action: "delete",
      entity: "testimonial",
      entityId: id,
      summary: "Eliminó testimonio",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err, "testimonials/delete");
  }
}
