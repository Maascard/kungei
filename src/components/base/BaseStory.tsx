"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const CHAPTERS = [
  {
    n: "01",
    title: "Живые ингредиенты",
    text: "Матча, обжаренный кофе, натуральные сливки и ягодные пюре — без искусственных ароматизаторов. Каждая партия проверяется на вкус перед тем, как попасть в пауч.",
    gradient: "from-[#3c5a2a] via-[#6f9a4a] to-[#c8dba5]",
  },
  {
    n: "02",
    title: "Формула бариста",
    text: "Рецептуры разрабатывают практикующие бариста: точные пропорции, баланс сладости и текстуры, который легко повторить дома или в дороге за секунды.",
    gradient: "from-[#6b3d1a] via-[#a9702f] to-[#e7c78f]",
  },
  {
    n: "03",
    title: "Забота в каждой упаковке",
    text: "Стабильное качество от партии к партии и удобный формат: разорвал, залил, взболтал. Меньше отходов, больше вкуса — в любой точке маршрута.",
    gradient: "from-[#7a3347] via-[#b5647f] to-[#f0c9d3]",
  },
];

export function BaseStory() {
  return (
    <section id="story" className="base-page relative overflow-hidden bg-baseblack py-24 sm:py-32">
      <div className="base-grain" />
      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-20 max-w-xl"
        >
          <span className="font-basedisplay text-[11px] font-medium uppercase tracking-[0.2em] text-basered">
            О бренде
          </span>
          <h2 className="mt-3 font-basedisplay text-3xl font-black uppercase leading-tight text-white sm:text-4xl">
            От идеи до паучa — три принципа, на которых всё держится
          </h2>
        </motion.div>

        <div className="flex flex-col gap-20 sm:gap-28">
          {CHAPTERS.map((ch, i) => {
            const fromLeft = i % 2 === 0;
            return (
              <div
                key={ch.n}
                className={`grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-14 ${
                  fromLeft ? "" : "sm:[direction:rtl]"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: fromLeft ? -90 : 90 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br ${ch.gradient} sm:[direction:ltr]`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="absolute bottom-5 left-6 font-basedisplay text-6xl font-black text-white/25 sm:text-7xl">
                    {ch.n}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: fromLeft ? 90 : -90 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                  className="sm:[direction:ltr]"
                >
                  <h3 className="font-basedisplay text-2xl font-extrabold uppercase text-white sm:text-3xl">
                    {ch.title}
                  </h3>
                  <p className="mt-4 max-w-md text-basecream/65">{ch.text}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
