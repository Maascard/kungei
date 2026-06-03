"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { ru } from "date-fns/locale";
import "react-day-picker/style.css";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useCart } from "./CartProvider";

// Date (локальный календарный день) -> "YYYY-MM-DD"
function keyOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayKey(): string {
  return keyOf(new Date());
}
function nightsBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}
function fmt(d: Date, locale: Locale): string {
  return d.toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU", {
    day: "numeric",
    month: "long",
  });
}

type Result = { link: string; channel: "whatsapp" | "instagram"; message: string };

export default function BookingSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [range, setRange] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState<null | "whatsapp" | "instagram">(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const { items: cartItems, clear: clearCart } = useCart();

  const loadAvailability = async () => {
    try {
      const res = await fetch("/api/availability", { cache: "no-store" });
      const data = await res.json();
      setDisabled(new Set<string>(data.disabled ?? []));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const isDayDisabled = (date: Date) => {
    const k = keyOf(date);
    return k < todayKey() || disabled.has(k);
  };

  // Проверяет, что между from и to нет занятых дней
  const rangeHasBlocked = (from: Date, to: Date) => {
    const cur = new Date(from);
    while (cur.getTime() <= to.getTime()) {
      if (disabled.has(keyOf(cur))) return true;
      cur.setDate(cur.getDate() + 1);
    }
    return false;
  };

  const onSelect = (next: DateRange | undefined) => {
    setError("");
    if (next?.from && next?.to && rangeHasBlocked(next.from, next.to)) {
      // Диапазон пересекает занятые даты — оставляем только дату заезда
      setRange({ from: next.from, to: undefined });
      setError(dict.booking.errorOverlap);
      return;
    }
    setRange(next);
  };

  const nights = useMemo(() => {
    if (range?.from && range?.to) return nightsBetween(range.from, range.to);
    return 0;
  }, [range]);

  const submit = async (channel: "whatsapp" | "instagram") => {
    setError("");
    if (!range?.from) {
      setError(dict.booking.errorNoDates);
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError(dict.booking.required);
      return;
    }
    const from = range.from;
    const to = range.to ?? range.from;

    setSubmitting(channel);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          startDate: keyOf(from),
          endDate: keyOf(to),
          guests,
          comment: comment.trim(),
          channel,
          locale,
          items: cartItems.map((i) => ({ kind: i.kind, title: i.title })),
        }),
      });

      if (res.status === 409) {
        setError(dict.booking.errorOverlap);
        await loadAvailability();
        setRange(undefined);
        return;
      }
      if (!res.ok) {
        setError(dict.booking.errorGeneric);
        return;
      }

      const data: Result = await res.json();
      // Копируем текст в буфер (полезно для Instagram, где нельзя подставить текст)
      try {
        await navigator.clipboard.writeText(data.message);
      } catch {
        /* ignore */
      }
      // Открываем мессенджер
      window.open(data.link, "_blank", "noopener,noreferrer");
      setResult(data);
      // Обновляем календарь, сбрасываем форму и корзину
      await loadAvailability();
      setRange(undefined);
      setName("");
      setPhone("");
      setComment("");
      clearCart();
    } catch {
      setError(dict.booking.errorGeneric);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <section id="booking" className="relative overflow-hidden bg-forest py-20 text-cream sm:py-28">
      <div className="blob left-1/2 top-[-4rem] h-72 w-72 -translate-x-1/2 animate-float bg-clay/25" />
      <div className="container-x relative z-10">
        <div className="mb-10 text-center">
          <h2 className="section-title text-cream">{dict.sections.bookingTitle}</h2>
          <p className="mt-3 text-cream/70">{dict.sections.bookingSubtitle}</p>
          <div className="title-accent-center" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Календарь */}
          <div className="rounded-2xl bg-cream p-5 text-charcoal shadow-soft sm:p-7">
            <h3 className="mb-1 font-display text-xl text-forest">
              {dict.booking.selectDates}
            </h3>
            <p className="mb-4 text-sm text-charcoal/55">
              {dict.booking.selectDatesHint}
            </p>
            <div className="flex justify-center">
              <DayPicker
                mode="range"
                locale={ru}
                weekStartsOn={1}
                numberOfMonths={1}
                disabled={isDayDisabled}
                selected={range}
                onSelect={onSelect}
                min={1}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-forest" />
                {dict.booking.legendFree}
              </span>
              <span className="flex items-center gap-2 text-charcoal/45">
                <span className="h-3 w-3 rounded-full bg-charcoal/20 line-through" />
                <s>{dict.booking.legendBusy}</s>
              </span>
            </div>
          </div>

          {/* Форма */}
          <div className="rounded-2xl bg-cream p-5 text-charcoal shadow-soft sm:p-7">
            {range?.from && (
              <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-xl bg-sand/60 px-4 py-3 text-sm">
                <span>
                  <b>{dict.booking.checkIn}:</b> {fmt(range.from, locale)}
                </span>
                {range.to && (
                  <span>
                    <b>{dict.booking.checkOut}:</b> {fmt(range.to, locale)}
                  </span>
                )}
                {nights > 0 && (
                  <span className="text-bronze">
                    {nights} {dict.booking.nights}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label">{dict.booking.name} *</label>
                <input
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dict.booking.namePlaceholder}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">{dict.booking.phone} *</label>
                  <input
                    className="field"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={dict.booking.phonePlaceholder}
                  />
                </div>
                <div>
                  <label className="label">{dict.booking.guests}</label>
                  <input
                    className="field"
                    type="number"
                    min={1}
                    max={200}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>
              </div>
              <div>
                <label className="label">{dict.booking.comment}</label>
                <textarea
                  className="field min-h-[90px] resize-y"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={dict.booking.commentPlaceholder}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              {cartItems.length > 0 && (
                <div className="rounded-xl bg-sand/60 px-4 py-3 text-sm text-charcoal/75">
                  🛒 {dict.cart.title}: <b>{cartItems.length}</b>
                  <div className="mt-1 text-charcoal/55">{dict.cart.orderNote}</div>
                </div>
              )}

              <div>
                <p className="label">{dict.booking.chooseChannel}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={submitting !== null}
                    onClick={() => submit("whatsapp")}
                    className="btn-wa disabled:opacity-60"
                  >
                    {submitting === "whatsapp"
                      ? dict.booking.submitting
                      : dict.buttons.sendWhatsapp}
                  </button>
                  <button
                    type="button"
                    disabled={submitting !== null}
                    onClick={() => submit("instagram")}
                    className="btn-ig disabled:opacity-60"
                  >
                    {submitting === "instagram"
                      ? dict.booking.submitting
                      : dict.buttons.sendInstagram}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка успеха */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-cream p-7 text-charcoal shadow-soft">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-forest">{dict.booking.successTitle}</h3>
            <p className="mt-2 text-sm text-charcoal/70">{dict.booking.successText}</p>
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 w-full ${result.channel === "whatsapp" ? "btn-wa" : "btn-ig"}`}
            >
              {dict.booking.successOpen}
            </a>
            <button
              onClick={() => setResult(null)}
              className="mt-3 w-full btn-outline"
            >
              {dict.booking.close}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
