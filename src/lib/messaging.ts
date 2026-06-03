import type { Locale } from "@/i18n/config";

export type OrderItem = { kind: "service" | "food"; title: string };

export type BookingMessageData = {
  name: string;
  phone: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  guests: number;
  comment?: string | null;
  items?: OrderItem[];
};

// Формирует готовый текст заявки для отправки в мессенджер.
export function buildBookingMessage(
  data: BookingMessageData,
  locale: Locale,
): string {
  const services = (data.items ?? []).filter((i) => i.kind === "service");
  const food = (data.items ?? []).filter((i) => i.kind === "food");
  const L =
    locale === "kk"
      ? {
          header: "Жаңа брондау өтінімі — Küngey коттеджі",
          name: "Аты",
          phone: "Телефон",
          date: "Күні",
          dates: "Күндері",
          guests: "Қонақтар",
          services: "Таңдалған қызметтер",
          food: "Мәзір",
          comment: "Пікір",
        }
      : {
          header: "Новая заявка на бронирование — коттедж Kungei",
          name: "Имя",
          phone: "Телефон",
          date: "Дата",
          dates: "Даты",
          guests: "Гостей",
          services: "Выбранные услуги",
          food: "Меню",
          comment: "Комментарий",
        };

  const lines = [
    L.header,
    "",
    `${L.name}: ${data.name}`,
    `${L.phone}: ${data.phone}`,
    data.startDate === data.endDate
      ? `${L.date}: ${data.startDate}`
      : `${L.dates}: ${data.startDate} — ${data.endDate}`,
    `${L.guests}: ${data.guests}`,
  ];

  if (services.length) {
    lines.push("", `${L.services}:`);
    services.forEach((s) => lines.push(`• ${s.title}`));
  }
  if (food.length) {
    lines.push("", `${L.food}:`);
    food.forEach((f) => lines.push(`• ${f.title}`));
  }
  if (data.comment) lines.push("", `${L.comment}: ${data.comment}`);

  return lines.join("\n");
}

// Краткий текст заказа для хранения в БД (для админки).
export function buildOrderSummary(items?: OrderItem[]): string {
  if (!items || items.length === 0) return "";
  const services = items.filter((i) => i.kind === "service").map((i) => i.title);
  const food = items.filter((i) => i.kind === "food").map((i) => i.title);
  const parts: string[] = [];
  if (services.length) parts.push("Услуги: " + services.join(", "));
  if (food.length) parts.push("Меню: " + food.join(", "));
  return parts.join(" | ");
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
