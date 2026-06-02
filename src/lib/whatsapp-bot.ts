import Anthropic from "@anthropic-ai/sdk";
import { getSettingsMap, getMenu, pick, toList } from "./content";
import { getDisabledDayKeys } from "./bookings";

const MODEL = process.env.CHATBOT_MODEL || "claude-opus-4-8";

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export function botConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Собирает системный промпт из данных о коттедже (на двух языках) + свободные/занятые даты.
async function buildSystemPrompt(): Promise<string> {
  const [settings, menu, disabled] = await Promise.all([
    getSettingsMap(),
    getMenu(),
    getDisabledDayKeys(),
  ]);

  const siteUrl = process.env.SITE_URL || "";
  const bookingUrl = siteUrl ? `${siteUrl.replace(/\/$/, "")}/ru#booking` : "";

  const menuText = menu
    .map((c) => {
      const items = c.items
        .filter((i) => i.available)
        .map((i) => `  - ${i.titleRu} / ${i.titleKk} — ${i.price} ₸`)
        .join("\n");
      return `${c.titleRu} / ${c.titleKk}:\n${items}`;
    })
    .join("\n");

  // Занятые даты на ближайшие ~90 дней
  const today = new Date();
  const horizon = new Date(today.getTime() + 90 * 86400000);
  const busy = disabled.filter((k) => {
    const d = new Date(k + "T00:00:00Z");
    return d >= today && d <= horizon;
  });
  const busyText = busy.length
    ? busy.join(", ")
    : "на ближайшее время занятых дат нет";

  return `Ты — дружелюбный ассистент по бронированию коттеджа «Kungei» (Инстаграм @${settings.instagram_handle}). Ты общаешься с клиентами в WhatsApp.

ВАЖНЫЕ ПРАВИЛА:
- Отвечай на том же языке, на котором пишет клиент: русский или казахский. Если язык неясен — отвечай по-русски.
- Отвечай кратко, тепло и по делу (2–5 предложений). Не выдумывай фактов, которых нет ниже.
- Не пиши размышления и пояснения о своём процессе — только готовый ответ клиенту.
- Когда клиент хочет забронировать или спрашивает про свободные даты — обязательно дай ссылку на сайт для онлайн-бронирования: ${bookingUrl || "(ссылка на сайт)"}
- На сайте клиент видит календарь, выбирает даты и оставляет заявку. Поощряй это.
- Если спрашивают то, чего ты не знаешь (например точную итоговую цену под конкретную дату) — предложи оставить заявку на сайте или дождаться ответа менеджера.

ИНФОРМАЦИЯ О КОТТЕДЖЕ:
- Сайт: ${siteUrl || "(не указан)"}
- Адрес: ${pick(settings, "address", "ru")}
- Вместимость: ${pick(settings, "capacity", "ru")}
- Стоимость: ${pick(settings, "price_from", "ru")}
- Описание: ${pick(settings, "about", "ru")}
- Подходит для: ${toList(pick(settings, "events", "ru")).join(", ")}
- Удобства: ${toList(pick(settings, "amenities", "ru")).join(", ")}
- Условия аренды: ${toList(pick(settings, "rules", "ru")).join("; ")}
- Телефон: ${settings.contact_phone_display}

МЕНЮ ЕДЫ:
${menuText || "(меню уточняется)"}

ЗАНЯТЫЕ ДАТЫ (недоступны для брони, формат ГГГГ-ММ-ДД):
${busyText}
Все остальные ближайшие даты считаются свободными. Точную доступность и бронирование клиент делает на сайте.`;
}

export type ChatTurn = { role: "user" | "assistant"; text: string };

// Генерирует ответ бота. history — предыдущие сообщения (старые → новые), последним идёт новое сообщение клиента.
export async function generateBotReply(history: ChatTurn[]): Promise<string> {
  const anthropic = getClient();
  if (!anthropic) {
    return "Спасибо за сообщение! Мы скоро ответим. Тем временем посмотрите наш сайт.";
  }

  const system = await buildSystemPrompt();

  const messages = history.map((t) => ({
    role: t.role,
    content: t.text,
  }));

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      // Кэшируем системный промпт (стабилен между запросами)
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ],
      // Быстрые лаконичные ответы для чата (без отдельной фазы размышления)
      output_config: { effort: "low" },
      messages,
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return text || "Извините, не удалось сформировать ответ. Напишите ещё раз, пожалуйста.";
  } catch (e) {
    console.error("Claude reply error", e);
    return "Извините, у нас временные неполадки. Пожалуйста, напишите чуть позже или оставьте заявку на сайте.";
  }
}
