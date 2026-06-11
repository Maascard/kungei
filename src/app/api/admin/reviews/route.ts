import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const { author, textRu, textKk, rating, imageUrl } = await req.json();
  if (!author || !textRu)
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const max = await prisma.review.aggregate({ _max: { sortOrder: true } });
  const review = await prisma.review.create({
    data: {
      author,
      textRu,
      textKk: textKk || null,
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      imageUrl: imageUrl || null,
      sortOrder: (max._max.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json({ ok: true, review });
}

export async function PATCH(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const { id, author, textRu, textKk, rating, imageUrl } = await req.json();
  if (!id) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const review = await prisma.review.update({
    where: { id },
    data: {
      ...(author !== undefined ? { author } : {}),
      ...(textRu !== undefined ? { textRu } : {}),
      ...(textKk !== undefined ? { textKk } : {}),
      ...(rating !== undefined
        ? { rating: Math.min(5, Math.max(1, Number(rating) || 5)) }
        : {}),
      ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
    },
  });
  return NextResponse.json({ ok: true, review });
}

export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
