import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "cancelled"];

// Изменить статус заявки
export async function PATCH(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { id, status } = await req.json();
  if (!id || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ ok: true, booking });
}

// Удалить заявку
export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
