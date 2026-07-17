// Shared helpers for ELC API route handlers.
import { requireAdmin } from "@/lib/auth";
import crypto from "crypto";

/** Returns 401 if not authenticated, otherwise the admin session payload. */
export async function adminGuard() {
  const admin = await requireAdmin();
  if (!admin) return null;
  return admin;
}

/** Standard 401 response */
export function unauthorized() {
  return Response.json({ error: "No autorizado" }, { status: 401 });
}

/** Standard 400 response */
export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

/** Standard 500 response that logs the error */
export function serverError(err: unknown, context?: string) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[api-error${context ? `:${context}` : ""}]`, err);
  return Response.json({ error: message }, { status: 500 });
}

/** Safely parse a JSON request body. Returns null on failure. */
export async function parseJson<T = unknown>(req: Request): Promise<T | null> {
  try {
    const text = await req.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/** Generate a short unique id (cuid-like) for filenames. */
export function cuid(): string {
  // timestamp base36 + random hex — sufficiently unique for filenames
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(8).toString("hex");
  return `${ts}${rand}`;
}

/** Sanitize a filename: keep word chars, dots, dashes; replace others with _. */
export function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.\-]/g, "_");
}

/** Lead status whitelist */
export const LEAD_STATUSES = ["new", "contacted", "enrolled", "archived"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === "string" && (LEAD_STATUSES as readonly string[]).includes(v);
}
