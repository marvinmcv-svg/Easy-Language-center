import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setSession } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Cuerpo de petición inválido" },
        { status: 400 },
      );
    }
    const { email, password } = body as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    await setSession({ id: admin.id, email: admin.email, name: admin.name });
    logActivity({
      actor: admin.email,
      action: "login",
      entity: "auth",
      summary: "Inició sesión",
    });
    return NextResponse.json({
      ok: true,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (err) {
    return serverError(err, "auth/login");
  }
}
