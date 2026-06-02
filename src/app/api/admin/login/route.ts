import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, signSession, cookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const token = await signSession(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...cookieOptions, value: token });
  return res;
}
