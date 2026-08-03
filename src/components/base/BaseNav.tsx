"use client";

import { motion } from "framer-motion";

const LINKS = [
  { href: "#catalog", label: "Каталог" },
  { href: "#story", label: "О бренде" },
  { href: "#contact", label: "Контакты" },
];

export function BaseNav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-baseblack/70 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-basered text-[10px] font-extrabold leading-[0.85] text-white">
            BA
            <br />
            SE
          </span>
          <span className="font-basedisplay text-sm font-medium tracking-wide text-basecream/90">
            the <span className="font-extrabold text-white">BASE</span>
          </span>
        </a>
        <nav className="hidden gap-8 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-basedisplay text-xs font-medium uppercase tracking-[0.12em] text-basecream/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#catalog"
          className="rounded-full bg-basered px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 sm:px-5"
        >
          Каталог
        </a>
      </div>
    </motion.header>
  );
}
