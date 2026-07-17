import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err, "auth/logout");
  }
}
