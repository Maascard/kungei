import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { generateBotReply, type ChatTurn } from "@/lib/whatsapp-bot";
import { sendWhatsappText } from "@/lib/whatsapp-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HISTORY_LIMIT = 12;

// ── Верификация webhook (Meta присылает GET при подключении) ──
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// Проверка подписи X-Hub-Signature-256 (если задан APP_SECRET)
function verifySignature(raw: string, signature: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true; // подпись не проверяем, если секрет не настроен
  if (!signature) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(raw).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  } catch {
    return false;
  }
}

// ── Приём входящих сообщений ──
export async function POST(req: NextRequest) {
  const raw = await req.text();

  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const changes = payload?.entry?.flatMap((e: any) => e.changes ?? []) ?? [];
    for (const change of changes) {
      const messages = change?.value?.messages ?? [];
      for (const msg of messages) {
        if (msg.type !== "text" || !msg.text?.body) continue;
        await handleIncoming(msg.from, msg.id, msg.text.body);
      }
    }
  } catch (e) {
    console.error("webhook processing error", e);
  }

  // Meta всегда нужно вернуть 200, иначе она будет повторять доставку
  return NextResponse.json({ ok: true });
}

async function handleIncoming(from: string, waMessageId: string, text: string) {
  // Сохраняем входящее сообщение + дедупликация по waMessageId
  try {
    await prisma.chatMessage.create({
      data: { waId: from, waMessageId, role: "user", text },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      // Это сообщение уже обработано (ретрай Meta) — выходим
      return;
    }
    throw e;
  }

  // Загружаем историю диалога (старые → новые)
  const rows = await prisma.chatMessage.findMany({
    where: { waId: from },
    orderBy: { createdAt: "desc" },
    take: HISTORY_LIMIT,
  });
  const history: ChatTurn[] = rows
    .reverse()
    .map((r) => ({ role: r.role as "user" | "assistant", text: r.text }));

  const reply = await generateBotReply(history);

  // Сохраняем ответ и отправляем в WhatsApp
  await prisma.chatMessage.create({
    data: { waId: from, role: "assistant", text: reply },
  });
  await sendWhatsappText(from, reply);
}
