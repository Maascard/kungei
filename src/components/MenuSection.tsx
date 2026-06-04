"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "./Reveal";
import AddButton from "./AddButton";

export type MenuItemView = {
  id: string;
  title: string;
  desc: string;
  price: number;
  imageUrl: string | null;
};
export type MenuCategoryView = {
  id: string;
  title: string;
  items: MenuItemView[];
};

export default function MenuSection({
  dict,
  categories,
}: {
  dict: Dictionary;
  categories: MenuCategoryView[];
}) {
  const [activeId, setActiveId] = useState<string>("all");

  if (categories.length === 0) return null;

  const visible =
    activeId === "all"
      ? categories
      : categories.filter((c) => c.id === activeId);

  return (
    <section id="menu" className="bg-cream py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mb-8 text-center">
          <h2 className="section-title">{dict.sections.menuTitle}</h2>
          <p className="mt-3 text-charcoal/60">{dict.sections.menuSubtitle}</p>
          <div className="title-accent-center" />
        </Reveal>

        {/* Категории */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <Tab active={activeId === "all"} onClick={() => setActiveId("all")}>
            {dict.buttons.all}
          </Tab>
          {categories.map((c) => (
            <Tab key={c.id} active={activeId === c.id} onClick={() => setActiveId(c.id)}>
              {c.title}
            </Tab>
          ))}
        </div>

        <div className="space-y-12">
          {visible.map((cat) => (
            <div key={cat.id}>
              {activeId === "all" && (
                <h3 className="mb-5 font-display text-2xl text-forest">{cat.title}</h3>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {cat.items.map((item, idx) => (
                  <Reveal key={item.id} delay={(idx % 2) * 80}>
                    <article className="lift flex h-full gap-4 rounded-2xl bg-white p-3 shadow-soft">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28"
                        />
                      )}
                      <div className="flex flex-1 flex-col justify-center py-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h4 className="font-medium text-charcoal">{item.title}</h4>
                          {item.price > 0 && (
                            <span className="whitespace-nowrap font-display text-lg text-bronze">
                              {item.price.toLocaleString("ru-RU")} {dict.menu.currency}
                            </span>
                          )}
                        </div>
                        {item.desc && (
                          <p className="mt-1 text-sm text-charcoal/60">{item.desc}</p>
                        )}
                        <div className="mt-3">
                          <AddButton
                            dict={dict}
                            item={{
                              id: `food:${item.id}`,
                              kind: "food",
                              title: item.title,
                              price: item.price,
                            }}
                          />
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-medium transition ${
        active
          ? "bg-forest text-cream"
          : "bg-white text-charcoal/70 hover:bg-sand"
      }`}
    >
      {children}
    </button>
  );
}
