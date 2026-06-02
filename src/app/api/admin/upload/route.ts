import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { guard } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

// Загрузка изображения в Vercel Blob. Требует BLOB_READ_WRITE_TOKEN.
// Если токен не задан — возвращает понятную ошибку (используйте вставку по URL).
export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error: "no_blob_token",
        message:
          "Загрузка файлов недоступна: не настроен BLOB_READ_WRITE_TOKEN. Добавьте фото по ссылке (URL) или настройте Vercel Blob.",
      },
      { status: 400 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const name = `kungei/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(name, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
