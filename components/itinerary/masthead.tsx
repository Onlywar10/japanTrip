"use client";

import { motion } from "motion/react";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "./language-provider";

export function Masthead() {
  const { t, lang } = useLanguage();
  const route = UI.route[lang];

  return (
    <header className="relative overflow-hidden bg-ink text-washi rounded-b-[26px] px-4 sm:px-8 lg:px-14 pt-24 pb-9">
      <span
        aria-hidden
        className="absolute right-[-3%] top-1/2 -translate-y-1/2 font-serif font-black select-none pointer-events-none text-[clamp(11rem,26vw,24rem)] leading-[0.8] text-white/5 z-0"
      >
        九州
      </span>

      <div className="relative z-[1] max-w-[1120px] mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 text-[0.7rem] tracking-[0.36em] uppercase text-[#e08a72] font-semibold mb-4 before:content-[''] before:w-9 before:h-px before:bg-[#e08a72]"
        >
          {t(UI.eyebrow)}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-black text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] tracking-tight text-[#f6f1e7]"
        >
          {t(UI.titleMain)}
          <span className="text-[0.28em] font-semibold text-[#d8c08a] tracking-[0.16em] ml-2 sm:ml-[0.6em] block sm:inline mt-2 sm:mt-0">
            {t(UI.titleJp)}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex flex-wrap items-center gap-y-1 font-serif text-[#f6f1e7]/90 text-[clamp(0.82rem,2vw,1.05rem)]"
        >
          {route.map((c, i) => (
            <span key={`${c}-${i}`} className="flex items-center">
              <span>{c}</span>
              {i < route.length - 1 ? (
                <span className="text-[#e08a72] font-bold mx-1.5">›</span>
              ) : null}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-3.5 text-[0.84rem] text-[#f6f1e7]/65 tracking-[0.02em]"
        >
          {t(UI.meta)}
        </motion.div>
      </div>
    </header>
  );
}
