"use client";

import { motion } from "framer-motion";
import { FLAVORS, PouchVisual } from "./Pouch";

const EASE = [0.16, 1, 0.3, 1] as const;
const DIRS = [
  { x: -60, y: 0 },
  { x: 0, y: 70 },
  { x: 60, y: 0 },
];

export function BaseCatalog() {
  return (
    <section id="catalog" className="base-page relative bg-baseink py-24 sm:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mb-16 max-w-xl text-center"
        >
          <span className="font-basedisplay text-[11px] font-medium uppercase tracking-[0.2em] text-basered">
            Каталог
          </span>
          <h2 className="mt-3 font-basedisplay text-3xl font-black uppercase text-white sm:text-4xl">
            Выбери свой вкус
          </h2>
          <p className="mt-4 text-basecream/60">
            Шесть базовых вкусов — от освежающей матчи до бархатистого
            крем-напитка. Каждый пауч рассчитан на одну идеальную порцию.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:grid-cols-3 lg:gap-x-8">
          {FLAVORS.map((flavor, i) => {
            const dir = DIRS[i % DIRS.length];
            return (
              <motion.div
                key={flavor.name}
                initial={{ opacity: 0, ...dir }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.12, ease: EASE }}
                whileHover={{ y: -8 }}
                className="mx-auto w-full max-w-[200px]"
              >
                <PouchVisual flavor={flavor} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
