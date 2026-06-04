import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateChatReply, type ChatTurn } from "@/lib/site-bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().trim().min(1).max(1500),
      }),
    )
    .min(1)
    .max(24),
});

// Простой лимит запросов по IP (best-effort, в памяти инстанса).
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count++;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", reply: "Слишком много сообщений подряд. Подождите минуту, пожалуйста." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  try {
    const reply = await generateChatReply(parsed.data.messages as ChatTurn[]);
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("chat error", e);
    return NextResponse.json(
      { error: "server", reply: "Извините, не получилось ответить. Напишите нам в WhatsApp — поможем." },
      { status: 200 },
    );
  }
}
