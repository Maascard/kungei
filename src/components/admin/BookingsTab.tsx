"use client";

import { useState } from "react";
import { apiJson, fmtDate } from "./api";

const STATUS_LABEL: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждено",
  cancelled: "Отменено",
};
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-charcoal/10 text-charcoal/50",
};

export default function BookingsTab({
  bookings,
  onChange,
}: {
  bookings: any[];
  onChange: () => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    await apiJson("/api/admin/bookings", "PATCH", { id, status });
    setBusy(null);
    onChange();
  };
  const remove = async (id: string) => {
    if (!confirm("Удалить заявку безвозвратно?")) return;
    setBusy(id);
    await apiJson("/api/admin/bookings", "DELETE", { id });
    setBusy(null);
    onChange();
  };

  const list =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              filter === f ? "bg-charcoal text-cream" : "bg-white text-charcoal/60"
            }`}
          >
            {f === "all" ? "Все" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-charcoal/50">Заявок нет.</p>
      ) : (
        <div className="space-y-3">
          {list.map((b) => {
            const range =
              fmtDate(b.startDate) === fmtDate(b.endDate)
                ? fmtDate(b.startDate)
                : `${fmtDate(b.startDate)} — ${fmtDate(b.endDate)}`;
            return (
              <div key={b.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-charcoal">{b.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[b.status]}`}
                      >
                        {STATUS_LABEL[b.status]}
                      </span>
                      <span className="rounded-full bg-sand px-2 py-0.5 text-xs text-charcoal/60">
                        {b.channel === "whatsapp" ? "WhatsApp" : "Instagram"}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-charcoal/70">
                      📅 {range} · 👥 {b.guests} · 📞{" "}
                      <a href={`tel:${b.phone}`} className="text-bronze hover:underline">
                        {b.phone}
                      </a>
                    </div>
                    {b.comment && (
                      <div className="mt-1 text-sm text-charcoal/55">💬 {b.comment}</div>
                    )}
                    <div className="mt-1 text-xs text-charcoal/40">
                      создана {new Date(b.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {b.status !== "confirmed" && (
                      <button
                        disabled={busy === b.id}
                        onClick={() => setStatus(b.id, "confirmed")}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Подтвердить
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        disabled={busy === b.id}
                        onClick={() => setStatus(b.id, "cancelled")}
                        className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600 disabled:opacity-50"
                      >
                        Отменить
                      </button>
                    )}
                    <button
                      disabled={busy === b.id}
                      onClick={() => remove(b.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-4 text-xs text-charcoal/40">
        Подсказка: «Ожидает» и «Подтверждено» блокируют даты в календаре. «Отменено»
        — освобождает даты.
      </p>
    </div>
  );
}
