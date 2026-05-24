"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DAYS, UI } from "@/lib/itinerary";
import { useLanguage } from "./language-provider";

interface Props {
  active: number;
  onSelect: (idx: number) => void;
}

export function DayNav({ active, onSelect }: Props) {
  const { t, lang } = useLanguage();

  return (
    <nav className="sticky top-[58px] z-50 mx-auto max-w-[1120px] flex gap-2 overflow-x-auto py-3.5 px-0.5 mb-6 no-scrollbar bg-gradient-to-b from-washi via-washi/95 to-transparent">
      {DAYS.map((d, i) => {
        const dl = lang === "en" ? `Day ${d.n}` : `第${parseInt(d.n, 10)}天`;
        const isActive = active === i;
        return (
          <motion.button
            key={d.n}
            onClick={() => onSelect(i)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className={cn(
              "shrink-0 min-w-[7.25rem] text-left rounded-[0.85rem] px-4 py-2.5 border transition-colors",
              "font-sans cursor-pointer",
              isActive
                ? "bg-ink border-ink text-washi"
                : "bg-card border-line text-ink hover:border-ink-faint"
            )}
            aria-pressed={isActive}
          >
            <span
              className={cn(
                "block text-[0.58rem] tracking-[0.24em] uppercase",
                isActive ? "text-white/55" : "text-ink-faint"
              )}
            >
              {dl}
            </span>
            <span className="block font-serif text-[1rem] font-semibold mt-0.5">
              {t(d.date)}
            </span>
            <span
              className={cn(
                "block text-[0.72rem] mt-0.5",
                isActive ? "text-white/70" : "text-ink-soft"
              )}
            >
              {t(d.city)}
            </span>
          </motion.button>
        );
      })}
      <span className="sr-only">{t(UI.dayLabel)}</span>
    </nav>
  );
}
