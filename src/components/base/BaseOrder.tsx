"use client";

import { motion } from "framer-motion";
import { FLAVORS, PouchVisual } from "./Pouch";

const EASE = [0.16, 1, 0.3, 1] as const;

export function BaseOrder() {
  return (
    <section className="base-page relative overflow-hidden bg-baseink py-24 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-basered/25 blur-[130px]" />

      <div className="container-x relative z-10 grid grid-cols-1 items-center gap-12 sm:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="font-basedisplay text-[11px] font-medium uppercase tracking-[0.2em] text-basered">
            Готовы попробовать?
          </span>
          <h2 className="mt-3 font-basedisplay text-3xl font-black uppercase leading-tight text-white sm:text-4xl">
            Закажите the BASE для себя или для команды
          </h2>
          <p className="mt-4 max-w-md text-basecream/65">
            Пишите нам напрямую — подскажем вкусы, оформим разовый заказ
            или оптовую поставку для кафе и офиса.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-basered px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5"
            >
              Написать в WhatsApp
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-basecream/90 transition-colors hover:border-white/50 hover:text-white"
            >
              Написать в Instagram
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 90, rotate: 8 }}
          whileInView={{ opacity: 1, x: 0, rotate: -4 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto w-full max-w-[190px]"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PouchVisual flavor={FLAVORS[2]} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
