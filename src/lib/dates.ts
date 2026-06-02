// Работа с датами для календаря бронирования.
// Все даты бронирования храним как полночь UTC, чтобы избежать сдвигов часовых поясов.
// Диапазон бронирования блокирует ВСЕ дни включительно [start, end].

// "YYYY-MM-DD" -> Date (полночь UTC)
export function dayKeyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// Date -> "YYYY-MM-DD" (по UTC)
export function dateToDayKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Нормализует дату к полуночи UTC того же календарного дня
export function normalizeDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

// Все ключи дней в диапазоне включительно
export function eachDayKey(start: Date, end: Date): string[] {
  const out: string[] = [];
  const cur = normalizeDay(start);
  const last = normalizeDay(end);
  while (cur.getTime() <= last.getTime()) {
    out.push(dateToDayKey(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

// Пересекаются ли два диапазона (включительно)
export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime();
}

export function nightsBetween(start: Date, end: Date): number {
  const ms = normalizeDay(end).getTime() - normalizeDay(start).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}
