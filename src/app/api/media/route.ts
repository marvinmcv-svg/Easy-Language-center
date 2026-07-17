import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError, cuid, sanitizeFilename } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const media = await db.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ media });
  } catch (err) {
    return serverError(err, "media/list");
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const alt = form.get("alt");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Archivo 'file' es requerido" },
        { status: 400 },
      );
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes" },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el tamaño máximo de 10MB" },
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "media");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = sanitizeFilename(file.name || "upload");
    const filename = `${cuid()}-${safeName}`;
    const fullPath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);

    const url = `/uploads/media/${filename}`;
    const altStr =
      typeof alt === "string" && alt.trim() ? alt.trim() : null;

    const media = await db.mediaAsset.create({
      data: {
        filename,
        url,
        mime: file.type,
        size: file.size,
        alt: altStr,
      },
    });

    logActivity({
      actor: admin.email,
      action: "create",
      entity: "media",
      entityId: media.id,
      summary: `Subió '${media.filename}'`,
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (err) {
    return serverError(err, "media/upload");
  }
}
