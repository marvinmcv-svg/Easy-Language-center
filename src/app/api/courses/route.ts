import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    const url = new URL(req.url);
    const featuredParam = url.searchParams.get("featured");

    // Build where clause: public sees only active; admin sees all
    const where: Record<string, unknown> = admin ? {} : { active: true };
    if (featuredParam === "1") {
      where.featured = true;
    }

    const courses = await db.course.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ courses });
  } catch (err) {
    return serverError(err, "courses/list");
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
    if (!data.title || typeof data.title !== "string") {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 },
      );
    }

    const course = await db.course.create({
      data: {
        language: typeof data.language === "string" ? data.language : "",
        title: String(data.title),
        level: typeof data.level === "string" ? data.level : null,
        type: typeof data.type === "string" ? data.type : "",
        schedule: typeof data.schedule === "string" ? data.schedule : null,
        description:
          typeof data.description === "string" ? data.description : null,
        price: typeof data.price === "string" ? data.price : null,
        priceNote:
          typeof data.priceNote === "string" ? data.priceNote : null,
        image: typeof data.image === "string" ? data.image : null,
        badge: typeof data.badge === "string" ? data.badge : null,
        featured: Boolean(data.featured),
        order: typeof data.order === "number" ? data.order : 0,
        active: data.active === undefined ? true : Boolean(data.active),
      },
    });
    logActivity({
      actor: admin.email,
      action: "create",
      entity: "course",
      entityId: course.id,
      summary: `Creó curso '${course.title}'`,
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    return serverError(err, "courses/create");
  }
}
