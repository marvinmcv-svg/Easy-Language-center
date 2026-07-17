import { db } from "@/lib/db";

export interface LogInput {
  actor: string;
  action: string; // create | update | delete | publish | login | logout
  entity: string; // course | lead | content | media | testimonial | teacher | settings | auth
  entityId?: string;
  summary: string;
}

export async function logActivity(input: LogInput) {
  try {
    await db.activityLog.create({ data: input });
  } catch (e) {
    console.error("[activity] failed to log", input, e);
  }
}
