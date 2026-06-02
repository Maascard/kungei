"use client";

import { useState, useCallback, useEffect } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Img = { id: string; url: string; caption: string };

export default function Gallery({
  dict,
  images,
}: {
  dict: Dictionary;
  images: Img[];
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="bg-cream py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-10 text-center">
          <h2 className="section-title">{dict.sections.galleryTitle}</h2>
          <p className="mt-3 text-charcoal/60">{dict.sections.gallerySubtitle}</p>
        </div>

        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className="group mb-3 block w-full overflow-hidden rounded-2xl sm:mb-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4"
          onClick={close}
        >
          <button
            className="absolute right-4 top-4 text-cream/80 hover:text-white"
            onClick={close}
            aria-label="close"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-cream/80 hover:text-white sm:left-6"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="prev"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active].url}
              alt={images[active].caption}
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
            {images[active].caption && (
              <figcaption className="mt-3 text-center text-sm text-cream/80">
                {images[active].caption}
              </figcaption>
            )}
          </figure>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-cream/80 hover:text-white sm:right-6"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="next"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      )}
    </section>
  );
}
