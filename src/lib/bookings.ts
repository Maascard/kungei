import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { eachDayKey, dateToDayKey, normalizeDay, rangesOverlap } from "./dates";

// Статусы, которые занимают даты (заявка в ожидании или подтверждённая)
export const BLOCKING_STATUSES = ["pending", "confirmed"];

// Возвращает список занятых дней ("YYYY-MM-DD") из бронирований и ручных блокировок.
export async function getDisabledDayKeys(): Promise<string[]> {
  const today = normalizeDay(new Date());

  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: {
        status: { in: BLOCKING_STATUSES },
        endDate: { gte: today },
      },
      select: { startDate: true, endDate: true },
    }),
    prisma.blockedRange.findMany({
      where: { endDate: { gte: today } },
      select: { startDate: true, endDate: true },
    }),
  ]);

  const set = new Set<string>();
  for (const b of [...bookings, ...blocked]) {
    for (const key of eachDayKey(b.startDate, b.endDate)) set.add(key);
  }
  return Array.from(set).sort();
}

// Проверяет, пересекается ли диапазон с существующими занятыми датами.
// Должна вызываться ВНУТРИ транзакции для защиты от двойного бронирования.
export async function hasConflict(
  tx: Prisma.TransactionClient,
  start: Date,
  end: Date,
): Promise<boolean> {
  const [bookings, blocked] = await Promise.all([
    tx.booking.findMany({
      where: {
        status: { in: BLOCKING_STATUSES },
        startDate: { lte: end },
        endDate: { gte: start },
      },
      select: { startDate: true, endDate: true },
    }),
    tx.blockedRange.findMany({
      where: { startDate: { lte: end }, endDate: { gte: start } },
      select: { startDate: true, endDate: true },
    }),
  ]);

  return [...bookings, ...blocked].some((r) =>
    rangesOverlap(start, end, r.startDate, r.endDate),
  );
}

export { dateToDayKey };
