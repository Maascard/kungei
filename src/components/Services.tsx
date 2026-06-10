"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "./Reveal";
import AddButton from "./AddButton";

type Service = { title: string; price: number; items: string[] };

const ICONS = ["home", "fire", "leaf", "dish"] as const;

export default function Services({
  dict,
  services,
}: {
  dict: Dictionary;
  services: Service[];
}) {
  if (services.length === 0) return null;
  return (
    <section id="services" className="relative overflow-hidden bg-cream py-20 sm:py-24">
      <div className="blob left-[-6rem] top-10 h-72 w-72 animate-float bg-clay/40" />
      <div
        className="blob bottom-0 right-[-5rem] h-80 w-80 animate-float bg-forest/15"
        style={{ animationDelay: "2s" }}
      />
      <div className="container-x relative z-10">
        <Reveal className="mb-10 text-center">
          <h2 className="section-title">{dict.sections.servicesTitle}</h2>
          <p className="mt-3 text-charcoal/60">{dict.sections.servicesSubtitle}</p>
          <div className="title-accent-center" />
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="lift group flex h-full flex-col items-center rounded-2xl border border-bronze/15 bg-white p-6 text-center shadow-soft">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-forest/15 to-clay/25 text-forest transition-transform duration-300 group-hover:scale-110">
                  <Icon name={ICONS[i % ICONS.length]} />
                </span>
                <h3 className="font-display text-xl text-forest">{s.title}</h3>
                {s.price > 0 && (
                  <div className="mt-1 font-display text-2xl text-bronze">
                    {s.price.toLocaleString("ru-RU")} {dict.menu.currency}
                  </div>
                )}
                <div className="my-4 h-px w-2/3 bg-gradient-to-r from-transparent via-bronze/40 to-transparent" />
                <ul className="space-y-2 text-sm leading-snug text-charcoal/75">
                  {s.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
                <div className="mt-auto w-full pt-5">
                  <AddButton
                    dict={dict}
                    full
                    item={{
                      id: `service:${s.title}`,
                      kind: "service",
                      title: s.title,
                      price: s.price,
                    }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Icon({ name }: { name: "home" | "fire" | "leaf" | "dish" }) {
  const c = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "home")
    return (
      <svg {...c}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  if (name === "fire")
    return (
      <svg {...c}>
        <path d="M12 3s4 3.5 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C8 9 6 11 6 14a6 6 0 0 0 12 0c0-5-6-11-6-11Z" />
      </svg>
    );
  if (name === "leaf")
    return (
      <svg {...c}>
        <path d="M4 20c0-9 7-15 16-15 0 9-6 15-15 15-1 0-1 0-1 0Z" />
        <path d="M9 15c2-2 5-4 9-5" />
      </svg>
    );
  return (
    <svg {...c}>
      <path d="M4 3v7a3 3 0 0 0 3 3v8M7 3v6M10 3v6" />
      <path d="M17 3c-1.5 0-3 2-3 5s1.5 4 3 4v9" />
    </svg>
  );
}
