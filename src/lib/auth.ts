import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { put, list } from "@vercel/blob";

const COOKIE_NAME = "admin_token";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- Mutable password hash storage ---

const HASH_BLOB_PREFIX = "credentials/admin-hash-";

async function getPasswordHash(slot: number): Promise<string | undefined> {
  try {
    const blobPath = `${HASH_BLOB_PREFIX}${slot}.txt`;
    const { blobs } = await list({ prefix: blobPath, limit: 1 });
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url, { cache: "no-store" });
      if (response.ok) {
        const hash = await response.text();
        if (hash.trim()) return hash.trim();
      }
    }
  } catch {
    // Fall through to env var
  }
  return process.env[`ADMIN_PASS_HASH_${slot}`];
}

export async function setPasswordHash(
  slot: number,
  hash: string
): Promise<void> {
  const blobPath = `${HASH_BLOB_PREFIX}${slot}.txt`;
  await put(blobPath, hash, {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const hash = await hashPassword(password);

  for (let i = 1; i <= 2; i++) {
    const envEmail = process.env[`ADMIN_EMAIL_${i}`];
    const storedHash = await getPasswordHash(i);
    if (
      envEmail &&
      storedHash &&
      envEmail.toLowerCase() === email.toLowerCase() &&
      storedHash === hash
    ) {
      return true;
    }
  }
  return false;
}

// --- Session tokens ---

export async function createToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// --- Password reset tokens ---

export async function createResetToken(email: string): Promise<string> {
  return new SignJWT({ email, purpose: "password-reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecret());
}

export async function verifyResetToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.purpose !== "password-reset") return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

// --- Admin slot lookup ---

export function findAdminSlot(email: string): number | null {
  for (let i = 1; i <= 2; i++) {
    const envEmail = process.env[`ADMIN_EMAIL_${i}`];
    if (envEmail && envEmail.toLowerCase() === email.toLowerCase()) {
      return i;
    }
  }
  return null;
}

export { COOKIE_NAME };
