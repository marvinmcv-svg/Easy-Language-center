import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";

// PUBLIC — submit a lead from the contact form.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Cuerpo de petición inválido" },
        { status: 400 },
      );
    }
    const data = body as Record<string, unknown>;

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const phone = typeof data.phone === "string" ? data.phone.trim() : "";

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nombre y teléfono son obligatorios" },
        { status: 400 },
      );
    }

    await db.lead.create({
      data: {
        name,
        phone,
        email:
          typeof data.email === "string" && data.email.trim()
            ? data.email.trim()
            : null,
        courseInterest:
          typeof data.courseInterest === "string" && data.courseInterest.trim()
            ? data.courseInterest.trim()
            : null,
        message:
          typeof data.message === "string" && data.message.trim()
            ? data.message.trim()
            : null,
        status: "new",
      },
    });

    // Do not expose the lead id to the public.
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return serverError(err, "leads/create");
  }
}

// ADMIN — list all leads, newest first.
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ leads });
  } catch (err) {
    return serverError(err, "leads/list");
  }
}
