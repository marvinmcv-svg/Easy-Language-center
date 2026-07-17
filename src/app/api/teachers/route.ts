import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    const admin = await requireAdmin();
    const where = admin ? {} : { active: true };
    const teachers = await db.teacher.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ teachers });
  } catch (err) {
    return serverError(err, "teachers/list");
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Cuerpo de petición inválido" },
        { status: 400 },
      );
    }
    const data = body as Record<string, unknown>;
    if (!data.name || typeof data.name !== "string") {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 },
      );
    }

    const teacher = await db.teacher.create({
      data: {
        name: String(data.name),
        role: typeof data.role === "string" ? data.role : null,
        bio: typeof data.bio === "string" ? data.bio : null,
        image: typeof data.image === "string" ? data.image : null,
        languages: typeof data.languages === "string" ? data.languages : null,
        active: data.active === undefined ? true : Boolean(data.active),
        order: typeof data.order === "number" ? data.order : 0,
      },
    });
    logActivity({
      actor: admin.email,
      action: "create",
      entity: "teacher",
      entityId: teacher.id,
      summary: `Creó profesor '${teacher.name}'`,
    });
    return NextResponse.json({ teacher }, { status: 201 });
  } catch (err) {
    return serverError(err, "teachers/create");
  }
}
