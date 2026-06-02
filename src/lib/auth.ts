import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "kungei_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET || "dev-insecure-secret-change-me-please";
  return new TextEncoder().encode(s);
}

export async function signSession(username: string): Promise<string> {
  return new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// Проверяет, авторизован ли текущий запрос (для серверных компонентов и роутов).
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME || "admin";
  const p = process.env.ADMIN_PASSWORD || "change-me-please";
  return username === u && password === p;
}

export const cookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
