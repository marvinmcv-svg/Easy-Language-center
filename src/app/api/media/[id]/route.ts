import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import { unlink } from "fs/promises";
import path from "path";

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

    const media = await db.mediaAsset.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json(
        { error: "Recurso no encontrado" },
        { status: 404 },
      );
    }

    // Best-effort delete file from disk.
    try {
      const fullPath = path.join(process.cwd(), "public", media.url);
      await unlink(fullPath);
    } catch {
      // ignore if file is missing
    }

    await db.mediaAsset.delete({ where: { id } });
    logActivity({
      actor: admin.email,
      action: "delete",
      entity: "media",
      entityId: id,
      summary: "Eliminó recurso de media",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err, "media/delete");
  }
}
