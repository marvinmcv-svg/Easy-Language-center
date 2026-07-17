import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SECTIONS, DEFAULT_CONTENT, parseSection } from "@/lib/content";
import { requireAdmin } from "@/lib/auth";

// GET /api/content
// Public: returns {sections: {hero:{...published}, ...}} for rendering the site.
// Admin-authenticated: also returns `draft` per section + updatedAt.
export async function GET(req: Request) {
  const admin = await requireAdmin();
  const rows = await db.siteContent.findMany();
  const bySection = new Map(rows.map((r) => [r.section, r]));

  const sections: Record<
    string,
    {
      id: string;
      label: string;
      published: unknown;
      draft?: unknown;
      updatedAt?: string;
    }
  > = {};

  for (const def of SECTIONS) {
    const row = bySection.get(def.key);
    const fallback = DEFAULT_CONTENT[def.key];
    sections[def.key] = {
      id: def.key,
      label: def.label,
      published: parseSection(row?.published, fallback),
      ...(admin
        ? {
            draft: parseSection(row?.draft, fallback),
            updatedAt: row?.updatedAt?.toISOString(),
          }
        : {}),
    };
  }

  return NextResponse.json({ sections });
}
