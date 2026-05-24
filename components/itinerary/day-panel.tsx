"use client";

import { motion } from "motion/react";
import { Car, Clock, Info, MapPin } from "lucide-react";
import type { Day } from "@/lib/itinerary";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "./language-provider";
import { Stop } from "./stop";
import { InfoCard } from "./info-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  day: Day;
}

export function DayPanel({ day }: Props) {
  const { t } = useLanguage();

  return (
    <motion.div
      key={day.n}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 md:gap-7 items-start"
    >
      <Card className="p-5 sm:p-7 md:p-9">
        <span aria-hidden className="accent-bar absolute top-0 left-0 h-[5px] w-full" />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="relative font-serif font-black text-[clamp(2.6rem,7vw,4.4rem)] leading-[0.8] text-gold/55">
            <b className="absolute left-0 -top-1 text-ink font-semibold text-[0.32em] tracking-[0.2em]">
              {t(UI.dayLabel)}
            </b>
            {day.n}
          </div>
          <div className="text-right flex-1 min-w-[150px]">
            <h3 className="font-serif font-bold text-[clamp(1.3rem,3.2vw,1.9rem)] leading-[1.12]">
              {t(day.title)}
            </h3>
            <span className="block text-[0.76rem] tracking-[0.14em] uppercase text-vermillion mt-1">
              {t(day.date)} · {t(day.dow)} · {t(day.city)}
            </span>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap my-4">
          <Badge>
            <Clock className="h-[13px] w-[13px] text-vermillion" strokeWidth={1.7} />
            {t(UI.start)} {day.start}
          </Badge>
          <Badge>
            <Car className="h-[13px] w-[13px] text-vermillion" strokeWidth={1.7} />
            {t(UI.car)} · {t(day.car)}
          </Badge>
          <Badge>
            <MapPin className="h-[13px] w-[13px] text-vermillion" strokeWidth={1.7} />
            {t(day.city)}
          </Badge>
        </div>

        {day.note ? (
          <div className="flex gap-2.5 items-start bg-vermillion/[0.07] border-l-[3px] border-vermillion rounded-r-[12px] py-3 px-4 mb-5 text-[0.85rem] text-vermillion-deep">
            <Info className="h-[17px] w-[17px] mt-0.5 shrink-0 text-vermillion" strokeWidth={1.7} />
            <span>{t(day.note)}</span>
          </div>
        ) : null}

        <div className="relative">
          {day.stops.map((s, i) => (
            <Stop key={i} stop={s} isLast={i === day.stops.length - 1} />
          ))}
        </div>
      </Card>

      <aside className="md:sticky md:top-36">
        <InfoCard day={day} />
      </aside>
    </motion.div>
  );
}
