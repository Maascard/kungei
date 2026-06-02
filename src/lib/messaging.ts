import type { Locale } from "@/i18n/config";

export type BookingMessageData = {
  name: string;
  phone: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  guests: number;
  comment?: string | null;
};

// Формирует готовый текст заявки для отправки в мессенджер.
export function buildBookingMessage(
  data: BookingMessageData,
  locale: Locale,
): string {
  if (locale === "kk") {
    const lines = [
      "Жаңа брондау өтінімі — Küngey коттеджі",
      "",
      `Аты: ${data.name}`,
      `Телефон: ${data.phone}`,
      data.startDate === data.endDate
        ? `Күні: ${data.startDate}`
        : `Күндері: ${data.startDate} — ${data.endDate}`,
      `Қонақтар: ${data.guests}`,
    ];
    if (data.comment) lines.push(`Пікір: ${data.comment}`);
    return lines.join("\n");
  }
  const lines = [
    "Новая заявка на бронирование — коттедж Kungei",
    "",
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    data.startDate === data.endDate
      ? `Дата: ${data.startDate}`
      : `Даты: ${data.startDate} — ${data.endDate}`,
    `Гостей: ${data.guests}`,
  ];
  if (data.comment) lines.push(`Комментарий: ${data.comment}`);
  return lines.join("\n");
}

// Ссылка для отправки в WhatsApp с готовым текстом.
export function whatsappLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

// Ссылка на чат в Instagram (текст подставить нельзя — открывается диалог).
export function instagramLink(handle: string): string {
  const clean = handle.replace(/^@/, "");
  return `https://ig.me/m/${clean}`;
}
