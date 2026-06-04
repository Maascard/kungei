"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type CartItem = {
  id: string;
  kind: "service" | "food";
  title: string;
  price: number; // цена за единицу, ₸ (0 — без цены)
  qty: number;
};

// То, что передаётся при добавлении (qty проставляется автоматически)
export type CartInput = Omit<CartItem, "qty">;

type CartContextType = {
  items: CartItem[];
  toggle: (item: CartInput) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  has: (id: string) => boolean;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "kungei_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((i) => ({
              id: String(i.id),
              kind: i.kind === "service" ? "service" : "food",
              title: String(i.title ?? ""),
              price: Number(i.price) || 0,
              qty: Math.max(1, Number(i.qty) || 1),
            })),
          );
        }
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, loaded]);

  const toggle = useCallback((item: CartInput) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, qty: 1 }],
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items],
  );

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        toggle,
        remove,
        setQty,
        clear,
        has,
        count: items.length,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      items: [],
      toggle: () => {},
      remove: () => {},
      setQty: () => {},
      clear: () => {},
      has: () => false,
      count: 0,
      total: 0,
    };
  }
  return ctx;
}
