import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const s = await getSession();
    if (!s) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
      authenticated: true,
      admin: { id: s.id, name: s.name, email: s.email },
    });
  } catch (err) {
    return serverError(err, "auth/me");
  }
}
