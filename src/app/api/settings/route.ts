import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import { DEFAULT_CONTACT } from "@/lib/brand";

export async function GET() {
  try {
    const config =
      (await db.siteConfig.findUnique({ where: { id: "singleton" } })) ?? null;
    if (!config) {
      // Fallback to default contact values.
      return NextResponse.json({ config: { id: "singleton", ...DEFAULT_CONTACT, heroTitle: "Aprende un nuevo idioma hoy", heroSubtitle: "Clases de inglés, italiano, portugués, francés, alemán y español. Presenciales y virtuales, con profesores calificados y horarios flexibles en Santa Cruz, Bolivia.", updatedAt: null } });
    }
    return NextResponse.json({ config });
  } catch (err) {
    return serverError(err, "settings/get");
  }
}

const STRING_FIELDS: (keyof typeof DEFAULT_CONTACT | "heroTitle" | "heroSubtitle")[] = [
  "phone",
  "phone2",
  "whatsapp",
  "email",
  "address",
  "instagram",
  "facebook",
  "tiktok",
  "mapEmbedUrl",
  "heroTitle",
  "heroSubtitle",
];

export async function PUT(req: Request) {
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

    // Pick only allowed string fields.
    const picked: Record<string, string> = {};
    for (const key of STRING_FIELDS) {
      if (key in data && typeof data[key] === "string") {
        picked[key] = data[key] as string;
      }
    }

    // Build create payload with defaults from DEFAULT_CONTACT so upsert works.
    const createPayload: Record<string, string> = {
      id: "singleton",
      phone: DEFAULT_CONTACT.phone,
      phone2: DEFAULT_CONTACT.phone2,
      whatsapp: DEFAULT_CONTACT.whatsapp,
      email: DEFAULT_CONTACT.email,
      address: DEFAULT_CONTACT.address,
      instagram: DEFAULT_CONTACT.instagram,
      facebook: DEFAULT_CONTACT.facebook,
      tiktok: DEFAULT_CONTACT.tiktok,
      mapEmbedUrl: DEFAULT_CONTACT.mapEmbedUrl,
      heroTitle: "Aprende un nuevo idioma hoy",
      heroSubtitle:
        "Clases de inglés, italiano, portugués, francés, alemán y español. Presenciales y virtuales, con profesores calificados y horarios flexibles en Santa Cruz, Bolivia.",
      ...picked,
    };

    const config = await db.siteConfig.upsert({
      where: { id: "singleton" },
      update: picked,
      create: createPayload,
    });

    logActivity({
      actor: admin.email,
      action: "update",
      entity: "settings",
      summary: "Actualizó configuración del sitio",
    });

    return NextResponse.json({ config });
  } catch (err) {
    return serverError(err, "settings/put");
  }
}
