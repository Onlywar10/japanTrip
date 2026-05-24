"use client";

import { motion } from "motion/react";
import { Info } from "lucide-react";
import { RESERVATIONS } from "@/lib/reservations";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";
import { ReservationCard } from "./reservation-card";

export function ReservationsView() {
  const { t } = useLanguage();

  return (
    <>
      <header className="relative overflow-hidden bg-ink text-washi rounded-b-[26px] px-4 sm:px-8 lg:px-14 pt-24 pb-9">
        <span
          aria-hidden
          className="absolute right-[-3%] top-1/2 -translate-y-1/2 font-serif font-black select-none pointer-events-none text-[clamp(11rem,26vw,24rem)] leading-[0.8] text-white/5 z-0"
        >
          予約
        </span>

        <div className="relative z-[1] max-w-[1120px] mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 text-[0.7rem] tracking-[0.36em] uppercase text-[#e08a72] font-semibold mb-4 before:content-[''] before:w-9 before:h-px before:bg-[#e08a72]"
          >
            {t(UI.tabReservations)}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-black text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1] tracking-tight text-[#f6f1e7]"
          >
            {t(UI.reservationsTitle)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-3.5 text-[0.92rem] text-[#f6f1e7]/70 max-w-2xl"
          >
            {t(UI.reservationsSub)}
          </motion.p>
        </div>
      </header>

      <section className="px-4 sm:px-8 lg:px-14 pb-20 pt-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="mb-6 flex gap-2.5 items-start rounded-[12px] bg-vermillion/[0.07] border-l-[3px] border-vermillion py-3 px-4 text-[0.85rem] text-vermillion-deep">
            <Info className="h-[17px] w-[17px] mt-0.5 shrink-0 text-vermillion" strokeWidth={1.7} />
            <span>{t(UI.placeholderBanner)}</span>
          </div>

          {RESERVATIONS.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-card/60 p-10 text-center text-ink-soft">
              {t(UI.reservationsEmpty)}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {RESERVATIONS.map((r, i) => (
                <ReservationCard key={r.id} reservation={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
