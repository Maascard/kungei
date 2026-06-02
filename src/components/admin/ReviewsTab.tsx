"use client";

import { useState } from "react";
import { apiJson } from "./api";

export default function ReviewsTab({
  reviews,
  onChange,
}: {
  reviews: any[];
  onChange: () => void;
}) {
  const [author, setAuthor] = useState("");
  const [textRu, setTextRu] = useState("");
  const [textKk, setTextKk] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!author || !textRu) return;
    setBusy(true);
    await apiJson("/api/admin/reviews", "POST", { author, textRu, textKk, rating });
    setBusy(false);
    setAuthor("");
    setTextRu("");
    setTextKk("");
    setRating(5);
    onChange();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    await apiJson("/api/admin/reviews", "DELETE", { id });
    onChange();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-medium text-charcoal">Добавить отзыв</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" placeholder="Имя автора" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <select className="field" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
        </div>
        <textarea className="field mt-3 min-h-[70px]" placeholder="Текст отзыва (рус)" value={textRu} onChange={(e) => setTextRu(e.target.value)} />
        <textarea className="field mt-3 min-h-[70px]" placeholder="Текст отзыва (қаз) — необязательно" value={textKk} onChange={(e) => setTextKk(e.target.value)} />
        <button onClick={add} disabled={busy || !author || !textRu} className="btn-primary mt-4">
          {busy ? "Добавляем…" : "Добавить отзыв"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-forest">{r.author}</span>
              <span className="text-bronze">{"★".repeat(r.rating)}</span>
            </div>
            <p className="mt-2 text-sm text-charcoal/70">{r.textRu}</p>
            {r.textKk && <p className="mt-1 text-sm text-charcoal/50">{r.textKk}</p>}
            <button onClick={() => remove(r.id)} className="mt-3 text-sm text-red-600 hover:underline">
              удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
