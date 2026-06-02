"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookingsTab from "./BookingsTab";
import BlockedTab from "./BlockedTab";
import GalleryTab from "./GalleryTab";
import MenuTab from "./MenuTab";
import ReviewsTab from "./ReviewsTab";
import SettingsTab from "./SettingsTab";

export type AdminData = {
  bookings: any[];
  blocked: any[];
  settings: Record<string, string>;
  gallery: any[];
  menu: any[];
  reviews: any[];
};

const TABS = [
  { id: "bookings", label: "Заявки" },
  { id: "blocked", label: "Календарь / блокировки" },
  { id: "gallery", label: "Галерея" },
  { id: "menu", label: "Меню" },
  { id: "reviews", label: "Отзывы" },
  { id: "settings", label: "Настройки" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard({ initial }: { initial: AdminData }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("bookings");

  const refresh = () => router.refresh();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const pendingCount = initial.bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl text-forest">Kungei · Админка</span>
            <a
              href="/ru"
              target="_blank"
              className="text-sm text-bronze hover:underline"
            >
              открыть сайт ↗
            </a>
          </div>
          <button onClick={logout} className="text-sm text-charcoal/60 hover:text-red-600">
            Выйти
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-forest text-cream"
                  : "bg-white text-charcoal/70 hover:bg-sand"
              }`}
            >
              {t.label}
              {t.id === "bookings" && pendingCount > 0 && (
                <span className="ml-2 rounded-full bg-bronze px-1.5 text-xs text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "bookings" && <BookingsTab bookings={initial.bookings} onChange={refresh} />}
        {tab === "blocked" && <BlockedTab blocked={initial.blocked} onChange={refresh} />}
        {tab === "gallery" && <GalleryTab gallery={initial.gallery} onChange={refresh} />}
        {tab === "menu" && <MenuTab menu={initial.menu} onChange={refresh} />}
        {tab === "reviews" && <ReviewsTab reviews={initial.reviews} onChange={refresh} />}
        {tab === "settings" && <SettingsTab settings={initial.settings} onChange={refresh} />}
      </div>
    </div>
  );
}
