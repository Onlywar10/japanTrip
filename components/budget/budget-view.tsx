"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";

import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";
import {
  categoryLabel,
  formatYen,
  type BudgetSummary,
  type BudgetTransaction,
} from "@/lib/budget-format";
import { cn } from "@/lib/utils";
import { TransactionForm } from "./transaction-form";

interface Props {
  transactions: BudgetTransaction[];
  summary: BudgetSummary;
}

export function BudgetView({ transactions, summary }: Props) {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetTransaction | null>(null);
  // Bumped on every open so the form remounts with fresh, prop-seeded state.
  const [formKey, setFormKey] = useState(0);

  const dateFmt = new Intl.DateTimeFormat(lang === "zh" ? "zh-TW" : "en-US", {
    month: "short",
    day: "numeric",
  });

  function openNew() {
    setEditing(null);
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  function openEdit(tx: BudgetTransaction) {
    setEditing(tx);
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  const negative = summary.balance < 0;

  return (
    <>
      {/* ── Header / balance hero ───────────────────────────── */}
      <header className="relative overflow-hidden bg-ink text-washi rounded-b-[26px] px-4 sm:px-8 lg:px-14 pt-24 pb-9">
        <span
          aria-hidden
          className="absolute right-[-3%] top-1/2 -translate-y-1/2 font-serif font-black select-none pointer-events-none text-[clamp(11rem,26vw,24rem)] leading-[0.8] text-white/5 z-0"
        >
          予算
        </span>

        <div className="relative z-[1] max-w-[1120px] mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 text-[0.7rem] tracking-[0.36em] uppercase text-[#e08a72] font-semibold mb-4 before:content-[''] before:w-9 before:h-px before:bg-[#e08a72]"
          >
            {t(UI.tabBudget)}
          </motion.span>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-[0.78rem] uppercase tracking-[0.22em] text-[#f6f1e7]/55"
          >
            {t(UI.balanceLeft)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "font-serif font-black tracking-tight leading-[1] tabular-nums",
              "text-[clamp(2.6rem,12vw,4.4rem)]",
              negative ? "text-[#e08a72]" : "text-[#f6f1e7]",
            )}
          >
            {formatYen(summary.balance)}
          </motion.div>

          {/* In / Out summary */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex flex-wrap items-center gap-2.5"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/8 ring-1 ring-inset ring-white/12 px-3.5 py-2">
              <ArrowDownLeft
                className="h-4 w-4 text-emerald-400"
                strokeWidth={2.2}
              />
              <span className="text-[0.7rem] uppercase tracking-wider text-[#f6f1e7]/55">
                {t(UI.totalIn)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-[#f6f1e7]">
                {formatYen(summary.totalIn)}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/8 ring-1 ring-inset ring-white/12 px-3.5 py-2">
              <ArrowUpRight
                className="h-4 w-4 text-[#e08a72]"
                strokeWidth={2.2}
              />
              <span className="text-[0.7rem] uppercase tracking-wider text-[#f6f1e7]/55">
                {t(UI.totalOut)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-[#f6f1e7]">
                {formatYen(summary.totalOut)}
              </span>
            </span>

            <button
              type="button"
              onClick={openNew}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-vermillion text-white px-4 h-10 text-[0.82rem] font-semibold hover:bg-vermillion-deep transition-colors"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} />
              {t(UI.addTransaction)}
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-4 max-w-md text-[0.86rem] text-[#f6f1e7]/55"
          >
            {t(UI.budgetSub)}
          </motion.p>
        </div>
      </header>

      {/* ── Transaction list ────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-14 pb-28 pt-7">
        <div className="max-w-[1120px] mx-auto">
          {transactions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-card/60 p-10 text-center text-ink-soft">
              {t(UI.budgetEmpty)}
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {transactions.map((tx, i) => {
                const income = tx.kind === "income";
                const meta = [
                  tx.category ? t(categoryLabel(tx.category)) : null,
                  tx.member,
                  dateFmt.format(new Date(tx.occurredAt)),
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <motion.li
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(i * 0.025, 0.3),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openEdit(tx)}
                      className="group flex w-full items-center gap-3.5 rounded-2xl border border-line bg-card px-3.5 py-3 text-left transition-colors hover:border-ink-faint active:bg-washi-2"
                    >
                      <span
                        className={cn(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                          income
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-vermillion/10 text-vermillion",
                        )}
                      >
                        {income ? (
                          <ArrowDownLeft className="h-5 w-5" strokeWidth={2.2} />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink">
                          {tx.description}
                        </span>
                        {meta ? (
                          <span className="mt-0.5 block truncate text-[0.78rem] text-ink-faint">
                            {meta}
                          </span>
                        ) : null}
                      </span>

                      <span
                        className={cn(
                          "shrink-0 text-[0.95rem] font-semibold tabular-nums",
                          income ? "text-emerald-600" : "text-ink",
                        )}
                      >
                        {income ? "+" : "−"}
                        {formatYen(tx.amount)}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Floating add (handy on mobile while scrolling) */}
      <button
        type="button"
        onClick={openNew}
        aria-label={t(UI.newTransaction)}
        className="fixed right-5 z-[90] grid h-14 w-14 place-items-center rounded-full bg-vermillion text-white shadow-[0_12px_28px_-8px_rgba(192,57,43,0.6)] hover:bg-vermillion-deep transition-colors bottom-[max(env(safe-area-inset-bottom),1.25rem)] sm:hidden"
      >
        <Plus className="h-6 w-6" strokeWidth={2.6} />
      </button>

      <TransactionForm
        key={formKey}
        open={open}
        editing={editing}
        onClose={() => setOpen(false)}
        onSaved={() => router.refresh()}
      />
    </>
  );
}
