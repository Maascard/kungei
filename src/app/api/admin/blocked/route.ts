import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/admin-guard";
import { dayKeyToDate, normalizeDay } from "@/lib/dates";

export const dynamic = "force-dynamic";

// Добавить ручную блокировку дат
export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { startDate, endDate, reason } = await req.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const start = normalizeDay(dayKeyToDate(startDate));
  const end = normalizeDay(dayKeyToDate(endDate));
  if (end.getTime() < start.getTime()) {
    return NextResponse.json({ error: "bad_range" }, { status: 400 });
  }
  const block = await prisma.blockedRange.create({
    data: { startDate: start, endDate: end, reason: reason || null },
  });
  return NextResponse.json({ ok: true, block });
}

export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  await prisma.blockedRange.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
