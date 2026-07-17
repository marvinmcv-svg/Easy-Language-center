import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError, isLeadStatus } from "@/lib/api-helpers";
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
    if ("status" in data) {
      if (!isLeadStatus(data.status)) {
        return NextResponse.json(
          { error: "Estado inválido" },
          { status: 400 },
        );
      }
      update.status = data.status;
    }
    if ("name" in data && typeof data.name === "string") update.name = data.name;
    if ("email" in data)
      update.email = data.email === null ? null : String(data.email);
    if ("phone" in data && typeof data.phone === "string") update.phone = data.phone;
    if ("courseInterest" in data)
      update.courseInterest =
        data.courseInterest === null ? null : String(data.courseInterest);
    if ("message" in data)
      update.message = data.message === null ? null : String(data.message);

    const lead = await db.lead.update({ where: { id }, data: update });
    logActivity({
      actor: admin.email,
      action: "update",
      entity: "lead",
      entityId: id,
      summary: "Actualizó lead (estado)",
    });
    return NextResponse.json({ lead });
  } catch (err) {
    return serverError(err, "leads/update");
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

    await db.lead.delete({ where: { id } });
    logActivity({
      actor: admin.email,
      action: "delete",
      entity: "lead",
      entityId: id,
      summary: "Eliminó lead",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err, "leads/delete");
  }
}
