import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hasConflict } from "@/lib/bookings";
import { dayKeyToDate, normalizeDay } from "@/lib/dates";
import { getSettingsMap } from "@/lib/content";
import {
  buildBookingMessage,
  whatsappLink,
  instagramLink,
} from "@/lib/messaging";
import { isLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

const dayKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Неверный формат даты");

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(5).max(30),
  startDate: dayKey,
  endDate: dayKey,
  guests: z.coerce.number().int().min(1).max(200),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
  channel: z.enum(["whatsapp", "instagram"]),
  locale: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const start = normalizeDay(dayKeyToDate(data.startDate));
  const end = normalizeDay(dayKeyToDate(data.endDate));

  if (end.getTime() < start.getTime()) {
    return NextResponse.json({ error: "bad_range" }, { status: 400 });
  }
  // Запрещаем бронирование прошедших дат
  if (start.getTime() < normalizeDay(new Date()).getTime()) {
    return NextResponse.json({ error: "past_date" }, { status: 400 });
  }

  const locale = data.locale && isLocale(data.locale) ? data.locale : "ru";

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        if (await hasConflict(tx, start, end)) {
          throw new ConflictError();
        }
        return tx.booking.create({
          data: {
            name: data.name,
            phone: data.phone,
            startDate: start,
            endDate: end,
            guests: data.guests,
            comment: data.comment || null,
            channel: data.channel,
            status: "pending",
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    // Формируем ссылку на мессенджер
    const settings = await getSettingsMap();
    const message = buildBookingMessage(
      {
        name: booking.name,
        phone: booking.phone,
        startDate: data.startDate,
        endDate: data.endDate,
        guests: booking.guests,
        comment: booking.comment,
      },
      locale,
    );

    const link =
      data.channel === "whatsapp"
        ? whatsappLink(settings.whatsapp_phone, message)
        : instagramLink(settings.instagram_handle);

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      channel: data.channel,
      link,
      message,
    });
  } catch (e) {
    if (e instanceof ConflictError) {
      return NextResponse.json({ error: "overlap" }, { status: 409 });
    }
    // Serializable может бросить ошибку сериализации при гонке — трактуем как конфликт
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      (e.code === "P2034" || e.code === "P2002")
    ) {
      return NextResponse.json({ error: "overlap" }, { status: 409 });
    }
    console.error("booking create error", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

class ConflictError extends Error {}
