"use client";

import { UI } from "@/lib/itinerary";
import { useLanguage } from "./language-provider";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="text-center px-5 pt-7 pb-12 text-[0.74rem] text-ink-faint font-serif">
      <div className="inline-grid place-items-center w-7 h-7 rounded-full bg-vermillion text-white text-[0.8rem] mb-2">
        旅
      </div>
      <div>{t(UI.foot)}</div>
    </footer>
  );
}
