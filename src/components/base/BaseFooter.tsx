"use client";

import { motion } from "framer-motion";

export function BaseFooter() {
  return (
    <footer id="contact" className="base-page border-t border-white/10 bg-baseink py-14">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-basered text-[10px] font-extrabold leading-[0.85] text-white">
              BA
              <br />
              SE
            </span>
            <div>
              <p className="font-basedisplay text-sm font-semibold text-white">the BASE</p>
              <p className="text-xs text-basecream/50">Beverage Production</p>
            </div>
          </div>

          <p className="max-w-sm text-sm text-basecream/50">
            По вопросам сотрудничества и оптовых поставок пишите нам — ответим
            в течение рабочего дня.
          </p>

          <div className="flex gap-4 text-xs uppercase tracking-wide text-basecream/60">
            <a href="#" className="transition-colors hover:text-white">Instagram</a>
            <a href="#" className="transition-colors hover:text-white">WhatsApp</a>
            <a href="#" className="transition-colors hover:text-white">Email</a>
          </div>
        </motion.div>

        <p className="mt-10 text-center text-xs text-basecream/30">
          © {new Date().getFullYear()} the BASE. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
