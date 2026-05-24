"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { DAYS } from "@/lib/itinerary";
import { DayNav } from "./day-nav";
import { DayPanel } from "./day-panel";

export function Planner() {
  const [active, setActive] = useState(0);

  return (
    <section className="px-4 sm:px-8 lg:px-14 pb-20">
      <DayNav active={active} onSelect={setActive} />
      <div className="max-w-[1120px] mx-auto">
        <AnimatePresence mode="wait">
          <DayPanel key={DAYS[active].n} day={DAYS[active]} />
        </AnimatePresence>
      </div>
    </section>
  );
}
