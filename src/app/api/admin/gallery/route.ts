import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const { url, captionRu, captionKk } = await req.json();
  if (!url) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const max = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });
  const image = await prisma.galleryImage.create({
    data: {
      url,
      captionRu: captionRu || null,
      captionKk: captionKk || null,
      sortOrder: (max._max.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json({ ok: true, image });
}

export async function PATCH(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const { id, captionRu, captionKk, sortOrder } = await req.json();
  if (!id) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const image = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...(captionRu !== undefined ? { captionRu } : {}),
      ...(captionKk !== undefined ? { captionKk } : {}),
      ...(sortOrder !== undefined ? { sortOrder } : {}),
    },
  });
  return NextResponse.json({ ok: true, image });
}

export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
