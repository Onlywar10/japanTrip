"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { UI } from "@/lib/itinerary";

export function Topbar() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-[100] flex items-center justify-between",
        "px-4 sm:px-8 lg:px-14 py-3 backdrop-blur-md",
        "bg-[rgba(22,28,42,0.78)] border-b transition-[border-color,box-shadow] duration-300",
        scrolled
          ? "border-white/10 shadow-[0_6px_24px_-16px_rgba(0,0,0,0.5)]"
          : "border-transparent"
      )}
    >
      <div className="flex items-center gap-3 font-serif">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vermillion text-washi text-sm font-bold ring-1 ring-inset ring-white/35 shrink-0">
          九
        </div>
        <div className="leading-tight">
          <b className="font-bold text-[1rem] text-[#f6f1e7] block">{t(UI.brand)}</b>
          <small className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-[#f6f1e7]/55">
            {t(UI.dates)}
          </small>
        </div>
      </div>

      <div className="flex border border-white/20 rounded-full overflow-hidden bg-white/5 shrink-0">
        {(["en", "zh"] as const).map((l) => {
          const on = lang === l;
          return (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "px-3 sm:px-3.5 py-1.5 text-[0.74rem] tracking-wide leading-none transition-colors",
                on
                  ? "bg-[#f6f1e7] text-ink font-semibold"
                  : "text-[#f6f1e7]/65 hover:text-[#f6f1e7]/90"
              )}
            >
              {l === "en" ? "EN" : "中文"}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
