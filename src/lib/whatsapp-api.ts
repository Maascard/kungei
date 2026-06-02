// Отправка сообщений через WhatsApp Cloud API (Meta).

const GRAPH = process.env.WHATSAPP_GRAPH_VERSION || "v21.0";

export function whatsappConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID,
  );
}

// Отправить текстовое сообщение пользователю.
export async function sendWhatsappText(to: string, body: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) {
    console.error("WhatsApp не настроен: нет ACCESS_TOKEN / PHONE_NUMBER_ID");
    return;
  }

  const url = `https://graph.facebook.com/${GRAPH}/${phoneId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      // WhatsApp ограничивает длину текста ~4096 символов
      text: { preview_url: true, body: body.slice(0, 4000) },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("WhatsApp send error", res.status, errText);
  }
}
