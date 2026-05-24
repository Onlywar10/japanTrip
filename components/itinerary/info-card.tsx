"use client";

import { BedDouble, Map as MapIcon, MapPin, Phone, Plane } from "lucide-react";
import type { Day } from "@/lib/itinerary";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "./language-provider";
import { gmap } from "@/lib/utils";

interface Props {
  day: Day;
}

export function InfoCard({ day }: Props) {
  const { t } = useLanguage();
  const h = day.hotel;
  const Icon = h.departure ? Plane : BedDouble;

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-ink text-washi p-6">
      <div
        aria-hidden
        className="absolute right-[-12px] bottom-[-34px] font-serif text-[9rem] font-black text-white/5 leading-none pointer-events-none"
      >
        {day.kanji}
      </div>

      <div className="flex items-center gap-2.5 text-[0.64rem] tracking-[0.26em] uppercase text-gold">
        <Icon className="h-4 w-4" strokeWidth={1.7} />
        {h.departure ? t(UI.dest) : t(UI.stay)}
      </div>

      <h4 className="font-serif text-[1.3rem] font-semibold mt-3 relative z-[1]">
        {t(h.name)}
      </h4>
      {h.jp ? <div className="text-[0.78rem] text-white/65 mb-4">{h.jp}</div> : null}

      <div className="flex gap-2.5 items-start text-[0.84rem] text-white/85 py-2 border-t border-white/10 relative z-[1]">
        <MapPin className="h-[15px] w-[15px] mt-[3px] shrink-0 text-gold" strokeWidth={1.7} />
        <span>{t(h.addr)}</span>
      </div>

      {h.tel ? (
        <div className="flex gap-2.5 items-start text-[0.84rem] text-white/85 py-2 border-t border-white/10 relative z-[1]">
          <Phone className="h-[15px] w-[15px] mt-[3px] shrink-0 text-gold" strokeWidth={1.7} />
          <a
            href={`tel:${h.tel.replace(/-/g, "")}`}
            className="border-b border-dotted border-white/40"
          >
            {h.tel}
          </a>
        </div>
      ) : null}

      <a
        href={gmap(h.maps)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-[1] mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/25 text-white px-4 py-2 text-[0.72rem] tracking-wide transition-colors hover:bg-vermillion hover:border-vermillion"
      >
        <MapIcon className="h-[14px] w-[14px]" strokeWidth={1.8} />
        {t(UI.openmap)}
      </a>
    </div>
  );
}
