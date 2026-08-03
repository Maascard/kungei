"use client";

import { motion, type Variants } from "framer-motion";
import { FLAVORS, PouchVisual } from "./Pouch";

const EASE = [0.16, 1, 0.3, 1] as const;

const fromDir: Record<"left" | "right" | "top" | "bottom", { x?: number; y?: number }> = {
  left: { x: -120 },
  right: { x: 120 },
  top: { y: -120 },
  bottom: { y: 120 },
};

function pouchVariants(dir: keyof typeof fromDir, rotate: number): Variants {
  return {
    hidden: { opacity: 0, rotate: rotate * 2.4, scale: 0.85, ...fromDir[dir] },
    show: {
      opacity: 1,
      rotate,
      scale: 1,
      x: 0,
      y: 0,
      transition: { duration: 1, ease: EASE },
    },
  };
}

const HERO_POUCHES: {
  flavor: (typeof FLAVORS)[number];
  dir: keyof typeof fromDir;
  rotate: number;
  className: string;
  delay: number;
  floatDelay: number;
}[] = [
  {
    flavor: FLAVORS[2],
    dir: "right",
    rotate: 8,
    className: "w-[40%] sm:w-[32%] top-[2%] right-[4%] sm:right-[0%] z-20",
    delay: 0.35,
    floatDelay: 0,
  },
  {
    flavor: FLAVORS[0],
    dir: "bottom",
    rotate: -6,
    className: "w-[36%] sm:w-[28%] bottom-[2%] right-[26%] sm:right-[30%] z-10",
    delay: 0.55,
    floatDelay: 0.4,
  },
  {
    flavor: FLAVORS[1],
    dir: "top",
    rotate: 10,
    className: "w-[30%] sm:w-[23%] top-[16%] right-[52%] sm:right-[54%] z-0 hidden sm:block",
    delay: 0.7,
    floatDelay: 0.8,
  },
  {
    flavor: FLAVORS[3],
    dir: "right",
    rotate: -4,
    className: "w-[26%] sm:w-[21%] bottom-[-4%] right-[0%] z-30 hidden sm:block",
    delay: 0.9,
    floatDelay: 1.2,
  },
];

export function BaseHero() {
  return (
    <section
      id="top"
      className="base-page relative flex min-h-[100svh] items-center overflow-hidden bg-baseblack pt-24"
    >
      <div className="base-grain" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-basered/20 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[100px]" />

      <div className="container-x relative z-10 grid w-full grid-cols-1 items-center gap-12 py-16 sm:grid-cols-2">
        <div className="max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 font-basedisplay text-[11px] font-medium uppercase tracking-[0.18em] text-basecream/70"
          >
            Beverage Production
          </motion.span>

          <h1 className="font-basedisplay text-4xl font-black uppercase leading-[1.02] text-white sm:text-5xl md:text-6xl">
            {["Напитки,", "которые", "задают тон"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE }}
                  className="block"
                >
                  {i === 2 ? <span className="text-basered">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="mt-6 max-w-md text-base text-basecream/70 sm:text-lg"
          >
            Матча, латте, фраппе и крем-напитки в удобной упаковке — яркий
            вкус в один шаг, без сиропов и лишних хлопот.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#catalog"
              className="group inline-flex items-center gap-2 rounded-full bg-basered px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5"
            >
              Смотреть каталог
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-basecream/90 transition-colors hover:border-white/50 hover:text-white"
            >
              О бренде
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-md sm:h-[460px]">
          {HERO_POUCHES.map((p, i) => (
            <motion.div
              key={i}
              variants={pouchVariants(p.dir, p.rotate)}
              initial="hidden"
              animate="show"
              transition={{ delay: p.delay }}
              className={`absolute ${p.className}`}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4.5,
                  delay: 1.4 + p.floatDelay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <PouchVisual flavor={p.flavor} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="base-scroll-cue absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-basecream/50 sm:flex"
      >
        <span className="font-basedisplay text-[10px] uppercase tracking-[0.2em]">Листайте</span>
        <span className="text-lg leading-none">↓</span>
      </motion.div>
    </section>
  );
}
