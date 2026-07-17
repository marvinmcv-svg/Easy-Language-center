import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    const admin = await requireAdmin();
    const where = admin ? {} : { active: true };
    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ testimonials });
  } catch (err) {
    return serverError(err, "testimonials/list");
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
    if (!data.content || typeof data.content !== "string") {
      return NextResponse.json(
        { error: "El contenido es requerido" },
        { status: 400 },
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name: String(data.name),
        role: typeof data.role === "string" ? data.role : null,
        content: String(data.content),
        rating:
          typeof data.rating === "number" && data.rating >= 1 && data.rating <= 5
            ? data.rating
            : 5,
        image: typeof data.image === "string" ? data.image : null,
        active: data.active === undefined ? true : Boolean(data.active),
        order: typeof data.order === "number" ? data.order : 0,
      },
    });
    logActivity({
      actor: admin.email,
      action: "create",
      entity: "testimonial",
      entityId: testimonial.id,
      summary: `Creó testimonio de '${testimonial.name}'`,
    });
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (err) {
    return serverError(err, "testimonials/create");
  }
}
