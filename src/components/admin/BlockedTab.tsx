"use client";

import { useState } from "react";
import { apiJson, fmtDate, dayKey } from "./api";

export default function BlockedTab({
  blocked,
  onChange,
}: {
  blocked: any[];
  onChange: () => void;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const add = async () => {
    setError("");
    if (!start || !end) {
      setError("Укажите даты начала и конца");
      return;
    }
    setBusy(true);
    const { ok } = await apiJson("/api/admin/blocked", "POST", {
      startDate: start,
      endDate: end,
      reason,
    });
    setBusy(false);
    if (!ok) {
      setError("Не удалось добавить блокировку");
      return;
    }
    setStart("");
    setEnd("");
    setReason("");
    onChange();
  };

  const remove = async (id: string) => {
    await apiJson("/api/admin/blocked", "DELETE", { id });
    onChange();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-medium text-charcoal">Заблокировать даты вручную</h3>
        <p className="mb-4 text-sm text-charcoal/55">
          Например, на время ремонта или личного использования. Эти даты станут
          недоступны для бронирования.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">С даты</label>
            <input type="date" className="field" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="label">По дату</label>
            <input type="date" className="field" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <label className="label mt-3">Причина (необязательно)</label>
        <input className="field" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ремонт, личное и т.п." />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button onClick={add} disabled={busy} className="btn-primary mt-4 w-full">
          {busy ? "Добавляем…" : "Заблокировать"}
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-medium text-charcoal">Заблокированные периоды</h3>
        {blocked.length === 0 ? (
          <p className="text-charcoal/50">Нет ручных блокировок.</p>
        ) : (
          <ul className="space-y-2">
            {blocked.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-lg bg-sand/50 px-3 py-2">
                <span className="text-sm">
                  {dayKey(b.startDate) === dayKey(b.endDate)
                    ? fmtDate(b.startDate)
                    : `${fmtDate(b.startDate)} — ${fmtDate(b.endDate)}`}
                  {b.reason && <span className="text-charcoal/50"> · {b.reason}</span>}
                </span>
                <button onClick={() => remove(b.id)} className="text-sm text-red-600 hover:underline">
                  удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
