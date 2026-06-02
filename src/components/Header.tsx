"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const sectionIds = [
  "gallery",
  "about",
  "menu",
  "booking",
  "reviews",
  "contacts",
] as const;

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabels: Record<(typeof sectionIds)[number], string> = {
    gallery: dict.nav.gallery,
    about: dict.nav.about,
    menu: dict.nav.menu,
    booking: dict.nav.booking,
    reviews: dict.nav.reviews,
    contacts: dict.nav.contacts,
  };

  // Путь для переключения языка (сохраняем остальную часть URL)
  const otherLocaleHref = (target: Locale) => {
    const rest = pathname.replace(/^\/(ru|kk)/, "");
    return `/${target}${rest || ""}`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-x flex items-center justify-between">
        <a
          href={`/${locale}#top`}
          className={`font-display text-xl font-semibold tracking-wide transition-colors ${
            scrolled ? "text-forest" : "text-cream drop-shadow"
          }`}
        >
          Kungei
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-charcoal/80 hover:text-forest"
                  : "text-cream/90 hover:text-white drop-shadow"
              }`}
            >
              {navLabels[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className={`flex overflow-hidden rounded-full border text-xs font-medium ${
              scrolled ? "border-forest/25" : "border-cream/40"
            }`}
          >
            {locales.map((l) => (
              <a
                key={l}
                href={otherLocaleHref(l)}
                className={`px-3 py-1.5 transition-colors ${
                  l === locale
                    ? "bg-forest text-cream"
                    : scrolled
                      ? "text-forest hover:bg-forest/10"
                      : "text-cream hover:bg-cream/20"
                }`}
              >
                {localeNames[l]}
              </a>
            ))}
          </div>

          <a href="#booking" className="hidden btn-primary sm:inline-flex">
            {dict.buttons.book}
          </a>

          <button
            aria-label="menu"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden ${scrolled ? "text-forest" : "text-cream"}`}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="lg:hidden">
          <div className="container-x mt-2 rounded-2xl bg-cream p-4 shadow-soft">
            <nav className="flex flex-col">
              {sectionIds.map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="border-b border-charcoal/10 py-3 text-charcoal/80 last:border-0"
                >
                  {navLabels[id]}
                </a>
              ))}
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="btn-primary mt-3"
              >
                {dict.buttons.book}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
