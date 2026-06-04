"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  ExternalLink,
  Info,
  Map as MapIcon,
  MapPin,
  Star,
  Ticket,
} from "lucide-react";
import type { Stop as StopT } from "@/lib/itinerary";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "./language-provider";
import { StopIcon } from "./stop-icon";
import { Badge } from "@/components/ui/badge";
import { cn, gmap } from "@/lib/utils";

interface Props {
  stop: StopT;
  isLast: boolean;
}

export function Stop({ stop, isLast }: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  if (stop.simple) {
    return (
      <div
        className={cn(
          "relative pl-11 ml-3.5 pb-4",
          isLast ? "border-l-2 border-transparent" : "border-l-2 border-line"
        )}
      >
        <div className="absolute left-[-16px] top-0.5 grid h-7 w-7 place-items-center rounded-full bg-washi border-2 border-line">
          <StopIcon type={stop.type} className="h-3.5 w-3.5 text-ink-soft" />
        </div>
        <div className="flex items-center gap-2 min-h-[28px]">
          {stop.time ? (
            <span className="font-serif text-[0.8rem] text-vermillion font-semibold tracking-[0.04em]">
              {stop.time}
              {stop.endTime ? (
                <span className="text-vermillion/55">{` – ${stop.endTime}`}</span>
              ) : null}
            </span>
          ) : null}
          <span className="text-[0.92rem] text-ink-soft">
            {t(stop.title)}
            {stop.pill ? (
              <Badge
                variant={stop.gold ? "gold" : "solid"}
                className="ml-2 align-middle"
              >
                {t(stop.pill)}
              </Badge>
            ) : null}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative pl-11 ml-3.5 pb-3.5",
        isLast ? "border-l-2 border-transparent" : "border-l-2 border-line"
      )}
    >
      <motion.div
        animate={{
          borderColor: open ? "var(--color-vermillion)" : "var(--color-line)",
          scale: open ? 1.07 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[-19px] top-0.5 grid h-[34px] w-[34px] place-items-center rounded-full bg-card border-2"
      >
        <StopIcon
          type={stop.type}
          className={cn(
            "h-[17px] w-[17px] transition-colors",
            open ? "text-vermillion" : "text-ink-soft"
          )}
        />
      </motion.div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left bg-transparent border-0 flex items-start gap-2.5 py-1 text-ink cursor-pointer group"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          {stop.time ? (
            <div className="font-serif text-[0.8rem] text-vermillion font-semibold tracking-[0.04em]">
              {stop.time}
              {stop.endTime ? (
                <span className="text-vermillion/55">{` – ${stop.endTime}`}</span>
              ) : null}
            </div>
          ) : null}
          <div className="text-[1.02rem] font-semibold leading-[1.3]">
            {t(stop.title)}
            {stop.pill ? (
              <Badge
                variant={stop.gold ? "gold" : "solid"}
                className="ml-2 align-middle"
              >
                {t(stop.pill)}
              </Badge>
            ) : null}
            {stop.jp ? (
              <span className="block text-[0.74rem] text-ink-faint font-normal mt-0.5">
                {stop.jp}
              </span>
            ) : null}
          </div>
        </div>
        <motion.span
          animate={{
            backgroundColor: open
              ? "rgba(192, 57, 43, 1)"
              : "rgba(192, 57, 43, 0)",
            borderColor: open
              ? "rgba(192, 57, 43, 1)"
              : "rgba(216, 205, 183, 1)",
            color: open ? "#ffffff" : "#6d6755",
          }}
          transition={{ duration: 0.3 }}
          className="mt-1.5 grid h-[22px] w-[22px] place-items-center rounded-full border shrink-0"
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex"
          >
            <ChevronDown className="h-3 w-3" strokeWidth={2} />
          </motion.span>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2.5 pb-4 pr-1">
              {stop.desc ? (
                <p className="text-[0.9rem] text-ink-soft mb-3">{t(stop.desc)}</p>
              ) : null}

              {stop.address ? (
                <div className="flex gap-2.5 items-start text-[0.84rem] py-1.5">
                  <MapPin
                    className="h-[15px] w-[15px] mt-[3px] shrink-0 text-gold"
                    strokeWidth={1.7}
                  />
                  <span>{stop.address}</span>
                </div>
              ) : null}

              {(stop.maps || stop.web || stop.reservationId) && (
                <div className="flex flex-wrap gap-2.5 mt-3">
                  {stop.maps ? (
                    <a
                      href={gmap(stop.maps)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink text-washi px-3.5 py-2 text-[0.74rem] tracking-wide font-medium transition-colors hover:bg-vermillion"
                    >
                      <MapIcon className="h-[14px] w-[14px]" strokeWidth={1.8} />
                      {t(UI.gmap)}
                    </a>
                  ) : null}
                  {stop.web ? (
                    <a
                      href={stop.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-washi text-ink border border-line px-3.5 py-2 text-[0.74rem] tracking-wide font-medium transition-colors hover:border-ink"
                    >
                      <ExternalLink
                        className="h-[14px] w-[14px]"
                        strokeWidth={1.8}
                      />
                      {t(UI.site)}
                    </a>
                  ) : null}
                  {stop.reservationId ? (
                    <Link
                      href={`/reservations#${stop.reservationId}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-vermillion text-washi px-3.5 py-2 text-[0.74rem] tracking-wide font-medium transition-colors hover:bg-vermillion-deep"
                    >
                      <Ticket className="h-[14px] w-[14px]" strokeWidth={1.8} />
                      {t(UI.viewReservation)}
                    </Link>
                  ) : null}
                </div>
              )}

              {stop.highlights ? (
                <>
                  <div className="flex items-center gap-1.5 text-[0.66rem] tracking-[0.2em] uppercase text-vermillion mt-4 mb-2.5 font-semibold">
                    <Star className="h-[14px] w-[14px]" strokeWidth={1.7} />
                    {t(UI.poi)}
                  </div>
                  <div className="flex flex-col gap-2">
                    {stop.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2 items-start text-[0.84rem]">
                        <span className="mt-2 h-[5px] w-[5px] shrink-0 rounded-full bg-gold" />
                        <span>
                          <b className="font-semibold">{t(h.title)}</b> — {t(h.body)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {stop.tip ? (
                <div className="flex gap-2.5 items-start mt-3.5 rounded-[11px] bg-[rgba(176,133,52,0.1)] py-2.5 px-3.5 text-[0.81rem]">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 text-gold" strokeWidth={1.8} />
                  <span>{t(stop.tip)}</span>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
