import { db } from "@/lib/db";
import crypto from "crypto";

export const SESSION_COOKIE = "elc_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const DEV_SECRET = "elc-dev-secret-change-me-in-production-please";

function resolveSecret(): string {
  const fromEnv = process.env.AUTH_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    // Never allow session tokens to be signed with a known/default secret in
    // production — that would let anyone forge an admin session.
    if (!fromEnv || fromEnv === DEV_SECRET) {
      throw new Error(
        "AUTH_SECRET must be set to a strong, unique value in production. " +
          "Generate one with `openssl rand -hex 32` and set it in the environment.",
      );
    }
    return fromEnv;
  }
  return fromEnv || DEV_SECRET;
}

const SECRET = resolveSecret();

// ---- Password hashing (scrypt) ----
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(test), Buffer.from(hash));
}

// ---- Session token (HMAC-signed JSON) ----
function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSessionToken(admin: { id: string; email: string; name: string }) {
  const payload = JSON.stringify({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const b64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = sign(b64);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload as {
      id: string;
      email: string;
      name: string;
      exp: number;
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

// ---- Helpers using Next.js cookies ----
import { cookies } from "next/headers";

export async function setSession(admin: {
  id: string;
  email: string;
  name: string;
}) {
  const token = createSessionToken(admin);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  // confirm admin still exists
  const admin = await db.admin.findUnique({ where: { id: session.id } });
  if (!admin) return null;
  return session;
}
