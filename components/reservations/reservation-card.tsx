"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  BedDouble,
  CalendarDays,
  ExternalLink,
  Hash,
  Info,
  Map as MapIcon,
  MapPin,
  Phone,
  Sparkles,
  Ticket,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Reservation, ReservationStatus, ReservationType } from "@/lib/reservations";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";
import { Card } from "@/components/ui/card";
import { cn, gmap } from "@/lib/utils";

const TYPE_ICON: Record<ReservationType, LucideIcon> = {
  hotel: BedDouble,
  restaurant: UtensilsCrossed,
  activity: Ticket,
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
  confirmed: "bg-[#1f6b3a]/10 text-[#1f6b3a] border-[#1f6b3a]/30",
  pending: "bg-gold/10 text-[#7b5a1a] border-gold/40",
  cancelled: "bg-vermillion/10 text-vermillion-deep border-vermillion/30",
};

interface Props {
  reservation: Reservation;
  index: number;
}

export function ReservationCard({ reservation: r, index }: Props) {
  const { t } = useLanguage();
  const TypeIcon = TYPE_ICON[r.type];

  return (
    <motion.div
      id={r.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-32"
    >
      <Card className="p-5 sm:p-7">
        <span aria-hidden className="accent-bar absolute top-0 left-0 h-[5px] w-full" />

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-washi border border-line shrink-0">
              <TypeIcon className="h-5 w-5 text-ink-soft" strokeWidth={1.6} />
            </div>
            <div>
              <div className="text-[0.62rem] tracking-[0.24em] uppercase text-ink-faint font-semibold">
                {t(UI.resType[r.type])}
              </div>
              <h3 className="font-serif text-[1.25rem] sm:text-[1.4rem] font-semibold leading-tight">
                {t(r.title)}
              </h3>
              {r.jp ? (
                <div className="text-[0.78rem] text-ink-faint mt-0.5">{r.jp}</div>
              ) : null}
            </div>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] tracking-wide font-semibold uppercase",
              STATUS_STYLES[r.status]
            )}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {t(UI.resStatus[r.status])}
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[0.86rem]">
          <Row
            icon={CalendarDays}
            label={t(r.dateLabel)}
            sub={r.timeLabel ? t(r.timeLabel) : undefined}
          />
          {r.party ? <Row icon={Users} label={t(r.party)} /> : null}

          {r.rooms && r.rooms.length > 0 ? (
            <div className="flex gap-2.5 items-start sm:col-span-2">
              <BedDouble className="h-[15px] w-[15px] mt-[3px] shrink-0 text-gold" strokeWidth={1.7} />
              <span>
                <span className="block text-[0.66rem] tracking-[0.18em] uppercase text-ink-faint">
                  {t(UI.rooms)}
                </span>
                <ul className="mt-0.5 space-y-0.5">
                  {r.rooms.map((room, i) => (
                    <li key={i}>
                      <span className="font-semibold tabular-nums">{room.count}×</span>{" "}
                      {t(room.desc)}
                    </li>
                  ))}
                </ul>
              </span>
            </div>
          ) : null}

          {r.meal ? <Row icon={UtensilsCrossed} label={t(r.meal)} caption={t(UI.meals)} /> : null}
          {r.plan ? <Row icon={Sparkles} label={t(r.plan)} caption={t(UI.plan)} /> : null}

          {r.confirmationNumbers && r.confirmationNumbers.length > 0 ? (
            <div className="flex gap-2.5 items-start">
              <Hash className="h-[15px] w-[15px] mt-[3px] shrink-0 text-gold" strokeWidth={1.7} />
              <span>
                <span className="block text-[0.66rem] tracking-[0.18em] uppercase text-ink-faint">
                  {t(UI.confirmationNumber)}
                </span>
                <span className="block font-mono tracking-tight space-y-0.5">
                  {r.confirmationNumbers.map((n) => (
                    <span key={n} className="block">
                      {n}
                    </span>
                  ))}
                </span>
              </span>
            </div>
          ) : null}

          {r.phone ? (
            <Row
              icon={Phone}
              label={r.phone}
              href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
            />
          ) : null}
          {r.address ? <Row icon={MapPin} label={r.address} className="sm:col-span-2" /> : null}
        </dl>

        {r.notes ? (
          <div className="mt-5 flex gap-2.5 items-start rounded-[12px] bg-[rgba(176,133,52,0.1)] py-3 px-3.5 text-[0.84rem]">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-gold" strokeWidth={1.8} />
            <span>
              <b className="font-semibold mr-1">{t(UI.notes)}:</b>
              {t(r.notes)}
            </span>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2.5">
          {r.bookingUrl ? (
            <a
              href={r.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink text-washi px-3.5 py-2 text-[0.74rem] tracking-wide font-medium transition-colors hover:bg-vermillion"
            >
              <ExternalLink className="h-[14px] w-[14px]" strokeWidth={1.8} />
              {t(UI.openBooking)}
            </a>
          ) : null}
          {r.address ? (
            <a
              href={gmap(r.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-washi text-ink border border-line px-3.5 py-2 text-[0.74rem] tracking-wide font-medium transition-colors hover:border-ink"
            >
              <MapIcon className="h-[14px] w-[14px]" strokeWidth={1.8} />
              {t(UI.gmap)}
            </a>
          ) : null}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-washi text-ink border border-line px-3.5 py-2 text-[0.74rem] tracking-wide font-medium transition-colors hover:border-ink"
          >
            <ArrowIcon />
            {t(UI.jumpToItinerary)} · {t(r.linkedStop)}
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

interface RowProps {
  icon: LucideIcon;
  label: string;
  caption?: string;
  sub?: string;
  href?: string;
  className?: string;
}

function Row({ icon: Icon, label, caption, sub, href, className }: RowProps) {
  const body = (
    <>
      <Icon className="h-[15px] w-[15px] mt-[3px] shrink-0 text-gold" strokeWidth={1.7} />
      <span>
        {caption ? (
          <span className="block text-[0.66rem] tracking-[0.18em] uppercase text-ink-faint">
            {caption}
          </span>
        ) : null}
        <span className="block">{label}</span>
        {sub ? <span className="block text-[0.78rem] text-ink-soft">{sub}</span> : null}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className={cn("flex gap-2.5 items-start hover:text-vermillion transition-colors", className)}
        href={href}
      >
        {body}
      </a>
    );
  }
  return <div className={cn("flex gap-2.5 items-start", className)}>{body}</div>;
}

function ArrowIcon() {
  return (
    <svg
      className="h-[14px] w-[14px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
