import Anthropic from "@anthropic-ai/sdk";
import { getSettingsMap, getMenu, pick, toList, toServices } from "./content";
import { getDisabledDayKeys } from "./bookings";
import type { Locale } from "@/i18n/config";

const MODEL = process.env.CHATBOT_MODEL || "claude-opus-4-8";

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export function chatConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Системный промпт для чат-бота на сайте — собирается из данных базы.
async function buildSystemPrompt(): Promise<string> {
  const [settings, menu, disabled] = await Promise.all([
    getSettingsMap(),
    getMenu(),
    getDisabledDayKeys(),
  ]);

  const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
  const wa = settings.whatsapp_phone;

  const fmtServices = (loc: Locale) =>
    toServices(pick(settings, "services", loc))
      .map((s) => `  - ${s.title}${s.price ? ` — ${s.price} ₸` : ""}${s.desc ? `: ${s.desc}` : ""}`)
      .join("\n");

  const menuText = menu
    .map((c) => {
      const items = c.items
        .filter((i) => i.available)
        .map((i) => `  - ${i.titleRu} / ${i.titleKk}${i.price ? ` — ${i.price} ₸` : ""}`)
        .join("\n");
      return `${c.titleRu} / ${c.titleKk}:\n${items}`;
    })
    .join("\n");

  const today = new Date();
  const horizon = new Date(today.getTime() + 90 * 86400000);
  const busy = disabled.filter((k) => {
    const d = new Date(k + "T00:00:00Z");
    return d >= today && d <= horizon;
  });
  const busyText = busy.length ? busy.join(", ") : "на ближайшее время занятых дат нет";

  return `Ты — дружелюбный виртуальный помощник на сайте коттеджа «Kungei» (бренд IGILIK BI, Instagram @${settings.instagram_handle}). Клиент общается с тобой в чате на сайте.

ПРАВИЛА:
- Отвечай на языке клиента: русский или казахский. Если язык неясен — по-русски.
- Кратко, тепло, по делу (2–5 предложений). Не выдумывай фактов, которых нет ниже.
- Не пиши размышлений — только готовый ответ.
- Когда клиент хочет забронировать или спрашивает про даты/цены — направляй на бронирование на этом сайте: предложи нажать кнопку «Забронировать» или прокрутить к разделу бронирования (внизу страницы есть календарь и форма).
- Можно собрать заказ: на сайте у блюд и услуг есть кнопки «Добавить» — выбранное попадает в корзину и в заявку.
- Если нужен живой человек или точная цена под конкретную дату — дай номер WhatsApp владельца: +${wa} (или предложи нажать кнопку WhatsApp на сайте).
- Точную доступность дат и финальную стоимость подтверждает менеджер.

ИНФОРМАЦИЯ О КОТТЕДЖЕ:
- Сайт: ${siteUrl || "(этот сайт)"}
- Адрес: ${pick(settings, "address", "ru")}
- Вместимость: ${pick(settings, "capacity", "ru")}
- О коттедже: ${pick(settings, "about", "ru")}
- Подходит для: ${toList(pick(settings, "events", "ru")).join(", ")}
- Удобства: ${toList(pick(settings, "amenities", "ru")).join(", ")}
- Условия аренды: ${toList(pick(settings, "rules", "ru")).join("; ")}
- WhatsApp: +${wa}; телефон: ${settings.contact_phone_display}

УСЛУГИ И ЦЕНЫ:
${fmtServices("ru")}

МЕНЮ (входит в пакет):
${menuText || "(уточняется)"}

ЗАНЯТЫЕ ДАТЫ (недоступны, формат ГГГГ-ММ-ДД):
${busyText}
Остальные ближайшие даты считаются свободными. Бронирование — на сайте.`;
}

export type ChatTurn = { role: "user" | "assistant"; text: string };

export async function generateChatReply(history: ChatTurn[]): Promise<string> {
  const anthropic = getClient();
  if (!anthropic) {
    return "Спасибо за вопрос! Сейчас подскажет менеджер — напишите нам в WhatsApp или оставьте заявку на сайте.";
  }
  const system = await buildSystemPrompt();
  const messages = history.slice(-16).map((t) => ({ role: t.role, content: t.text }));

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 700,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    output_config: { effort: "low" },
    messages,
  });

  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}
