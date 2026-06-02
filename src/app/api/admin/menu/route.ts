import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

// Универсальный обработчик меню.
// body: { entity: "category" | "item", action: "create" | "update" | "delete", data: {...} }
export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { entity, action, data } = await req.json();

  try {
    if (entity === "category") {
      if (action === "create") {
        const max = await prisma.menuCategory.aggregate({ _max: { sortOrder: true } });
        const cat = await prisma.menuCategory.create({
          data: {
            titleRu: data.titleRu || "",
            titleKk: data.titleKk || "",
            sortOrder: (max._max.sortOrder ?? 0) + 1,
          },
        });
        return NextResponse.json({ ok: true, item: cat });
      }
      if (action === "update") {
        const cat = await prisma.menuCategory.update({
          where: { id: data.id },
          data: {
            ...(data.titleRu !== undefined ? { titleRu: data.titleRu } : {}),
            ...(data.titleKk !== undefined ? { titleKk: data.titleKk } : {}),
            ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
          },
        });
        return NextResponse.json({ ok: true, item: cat });
      }
      if (action === "delete") {
        await prisma.menuCategory.delete({ where: { id: data.id } });
        return NextResponse.json({ ok: true });
      }
    }

    if (entity === "item") {
      if (action === "create") {
        const max = await prisma.menuItem.aggregate({
          where: { categoryId: data.categoryId },
          _max: { sortOrder: true },
        });
        const item = await prisma.menuItem.create({
          data: {
            categoryId: data.categoryId,
            titleRu: data.titleRu || "",
            titleKk: data.titleKk || "",
            descRu: data.descRu || null,
            descKk: data.descKk || null,
            price: Number(data.price) || 0,
            imageUrl: data.imageUrl || null,
            available: data.available ?? true,
            sortOrder: (max._max.sortOrder ?? 0) + 1,
          },
        });
        return NextResponse.json({ ok: true, item });
      }
      if (action === "update") {
        const item = await prisma.menuItem.update({
          where: { id: data.id },
          data: {
            ...(data.titleRu !== undefined ? { titleRu: data.titleRu } : {}),
            ...(data.titleKk !== undefined ? { titleKk: data.titleKk } : {}),
            ...(data.descRu !== undefined ? { descRu: data.descRu } : {}),
            ...(data.descKk !== undefined ? { descKk: data.descKk } : {}),
            ...(data.price !== undefined ? { price: Number(data.price) || 0 } : {}),
            ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
            ...(data.available !== undefined ? { available: data.available } : {}),
          },
        });
        return NextResponse.json({ ok: true, item });
      }
      if (action === "delete") {
        await prisma.menuItem.delete({ where: { id: data.id } });
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  } catch (e) {
    console.error("menu admin error", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
