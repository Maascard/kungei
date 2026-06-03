"use client";

import { useCart, type CartItem } from "./CartProvider";
import type { Dictionary } from "@/i18n/dictionaries";

// Кнопка-переключатель «Добавить в корзину» / «В корзине».
export default function AddButton({
  item,
  dict,
  full = false,
}: {
  item: CartItem;
  dict: Dictionary;
  full?: boolean;
}) {
  const { toggle, has } = useCart();
  const active = has(item.id);

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      aria-pressed={active}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
        full ? "w-full" : ""
      } ${
        active
          ? "bg-forest text-cream"
          : "border border-forest/30 text-forest hover:bg-forest hover:text-cream"
      }`}
    >
      {active ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {dict.buttons.inCart}
        </>
      ) : (
        <>
          <span className="text-base leading-none">+</span>
          {dict.buttons.addToCart}
        </>
      )}
    </button>
  );
}
