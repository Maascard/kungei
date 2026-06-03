"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import type { Dictionary } from "@/i18n/dictionaries";

export default function FloatingButtons({
  dict,
  waLink,
  igLink,
}: {
  dict: Dictionary;
  waLink: string;
  igLink: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { items, remove, clear, count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = scrolled || count > 0;
  const services = items.filter((i) => i.kind === "service");
  const food = items.filter((i) => i.kind === "food");

  const goToBooking = () => {
    setOpen(false);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Панель корзины */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-charcoal/30"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-24 right-5 z-50 max-h-[70vh] w-[min(92vw,22rem)] overflow-auto rounded-2xl bg-cream p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-xl text-forest">{dict.cart.title}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-charcoal/50 hover:text-charcoal"
                aria-label="close"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {count === 0 ? (
              <p className="py-6 text-center text-sm text-charcoal/55">{dict.cart.empty}</p>
            ) : (
              <div className="space-y-4">
                {services.length > 0 && (
                  <CartGroup title={dict.cart.servicesGroup} items={services} onRemove={remove} />
                )}
                {food.length > 0 && (
                  <CartGroup title={dict.cart.foodGroup} items={food} onRemove={remove} />
                )}

                <p className="rounded-lg bg-sand/60 px-3 py-2 text-xs text-charcoal/60">
                  {dict.cart.orderNote}
                </p>

                <div className="flex gap-2">
                  <button onClick={clear} className="btn-outline flex-1 !py-2 text-sm">
                    {dict.cart.clear}
                  </button>
                  <button onClick={goToBooking} className="btn-primary flex-1 !py-2 text-sm">
                    {dict.cart.checkout}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Плавающие кнопки */}
      <div
        className={`fixed bottom-5 right-5 z-40 flex flex-col gap-3 transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {/* Корзина */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={dict.cart.title}
          className="relative flex items-center justify-center rounded-full bg-forest p-3.5 text-cream shadow-soft transition hover:scale-105"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2 3h2.2l2.1 12.4a1.5 1.5 0 0 0 1.5 1.2h8.9a1.5 1.5 0 0 0 1.5-1.2L21 7H5.5" />
          </svg>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-bronze px-1 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </button>

        <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-soft transition hover:scale-105">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .5l-.3.5-.3.3c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.1.1.5-.1 1Z" />
          </svg>
        </a>
        <a href={igLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center rounded-full p-3.5 text-white shadow-soft transition hover:scale-105" style={{ backgroundImage: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1Zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.2-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0Z" />
          </svg>
        </a>
      </div>
    </>
  );
}

function CartGroup({
  title,
  items,
  onRemove,
}: {
  title: string;
  items: { id: string; title: string }[];
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bronze">
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li
            key={i.id}
            className="flex items-start justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm text-charcoal"
          >
            <span className="flex-1">{i.title}</span>
            <button
              onClick={() => onRemove(i.id)}
              className="text-charcoal/40 hover:text-red-600"
              aria-label="remove"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
