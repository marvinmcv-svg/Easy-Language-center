import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";

const HEADERS = [
  "Nombre",
  "Telefono",
  "Email",
  "Interes",
  "Mensaje",
  "Estado",
  "FechaCreacion",
];

function escapeCsv(value: string | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const rows: string[] = [HEADERS.map(escapeCsv).join(",")];
    for (const lead of leads) {
      rows.push(
        [
          escapeCsv(lead.name),
          escapeCsv(lead.phone),
          escapeCsv(lead.email),
          escapeCsv(lead.courseInterest),
          escapeCsv(lead.message),
          escapeCsv(lead.status),
          escapeCsv(lead.createdAt.toISOString()),
        ].join(","),
      );
    }

    const csvBody = rows.join("\r\n");

    return new Response(csvBody, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="leads-elc.csv"',
      },
    });
  } catch (err) {
    return serverError(err, "leads/export");
  }
}
