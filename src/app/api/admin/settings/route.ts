import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

// Массовое обновление настроек: { entries: { key, value }[] }
export async function PUT(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { entries } = await req.json();
  if (!Array.isArray(entries)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  await prisma.$transaction(
    entries
      .filter((e) => e && typeof e.key === "string")
      .map((e: { key: string; value: string }) =>
        prisma.setting.upsert({
          where: { key: e.key },
          update: { value: String(e.value ?? "") },
          create: { key: e.key, value: String(e.value ?? "") },
        }),
      ),
  );

  return NextResponse.json({ ok: true });
}
