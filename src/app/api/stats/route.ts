import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const [
      leads,
      leadsNew,
      courses,
      testimonials,
      teachers,
      media,
      statusNew,
      statusContacted,
      statusEnrolled,
      statusArchived,
      recentLeads,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "new" } }),
      db.course.count(),
      db.testimonial.count(),
      db.teacher.count(),
      db.mediaAsset.count(),
      db.lead.count({ where: { status: "new" } }),
      db.lead.count({ where: { status: "contacted" } }),
      db.lead.count({ where: { status: "enrolled" } }),
      db.lead.count({ where: { status: "archived" } }),
      db.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          phone: true,
          courseInterest: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      leads,
      leadsNew,
      courses,
      testimonials,
      teachers,
      media,
      byStatus: {
        new: statusNew,
        contacted: statusContacted,
        enrolled: statusEnrolled,
        archived: statusArchived,
      },
      recentLeads,
    });
  } catch (err) {
    return serverError(err, "stats");
  }
}
