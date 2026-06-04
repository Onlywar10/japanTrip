"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";

import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";
import {
  categoryLabel,
  formatYen,
  summarize,
  type AccountTransaction,
  type MemberAccount,
} from "@/lib/budget-format";
import { deleteMember } from "@/lib/member-actions";
import { cn } from "@/lib/utils";
import { MemberForm } from "./member-form";
import { MemberTransactionForm } from "./member-transaction-form";

interface Props {
  members: MemberAccount[];
  transactionsByMember: Record<string, AccountTransaction[]>;
}

export function MembersView({ members, transactionsByMember }: Props) {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(
    members[0]?.id ?? null,
  );

  const [txOpen, setTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<AccountTransaction | null>(null);
  const [txKey, setTxKey] = useState(0);

  const [memberOpen, setMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberAccount | null>(null);
  const [memberKey, setMemberKey] = useState(0);

  const dateFmt = new Intl.DateTimeFormat(lang === "zh" ? "zh-TW" : "en-US", {
    month: "short",
    day: "numeric",
  });

  const selected =
    members.find((m) => m.id === selectedId) ?? members[0] ?? null;
  const txns = selected ? (transactionsByMember[selected.id] ?? []) : [];
  const summary = summarize(txns);
  const negative = summary.balance < 0;

  function openNewPerson() {
    setEditingMember(null);
    setMemberKey((k) => k + 1);
    setMemberOpen(true);
  }
  function openEditPerson() {
    if (!selected) return;
    setEditingMember(selected);
    setMemberKey((k) => k + 1);
    setMemberOpen(true);
  }
  function handleDeletePerson() {
    if (!selected) return;
    if (!confirm(t(UI.confirmDeletePerson))) return;
    deleteMember(selected.id).then(() => {
      setSelectedId(null);
      router.refresh();
    });
  }

  function openNewTx() {
    setEditingTx(null);
    setTxKey((k) => k + 1);
    setTxOpen(true);
  }
  function openEditTx(tx: AccountTransaction) {
    setEditingTx(tx);
    setTxKey((k) => k + 1);
    setTxOpen(true);
  }

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-ink text-washi rounded-b-[26px] px-4 sm:px-8 lg:px-14 pt-24 pb-8">
        <span
          aria-hidden
          className="absolute right-[-3%] top-1/2 -translate-y-1/2 font-serif font-black select-none pointer-events-none text-[clamp(11rem,26vw,24rem)] leading-[0.8] text-white/5 z-0"
        >
          個人
        </span>

        <div className="relative z-[1] max-w-[1120px] mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 text-[0.7rem] tracking-[0.36em] uppercase text-[#e08a72] font-semibold mb-4 before:content-[''] before:w-9 before:h-px before:bg-[#e08a72]"
          >
            {t(UI.tabMembers)}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-black text-[clamp(2rem,5vw,3.2rem)] leading-[1] tracking-tight text-[#f6f1e7]"
          >
            {t(UI.membersTitle)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-3 max-w-md text-[0.88rem] text-[#f6f1e7]/60"
          >
            {t(UI.membersSub)}
          </motion.p>

          {/* Member selector */}
          <div className="mt-6 flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {members.map((m) => {
              const bal = summarize(transactionsByMember[m.id] ?? []).balance;
              const on = selected?.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedId(m.id)}
                  className={cn(
                    "shrink-0 rounded-2xl border px-4 py-2.5 text-left transition-colors min-w-[7rem]",
                    on
                      ? "bg-[#f6f1e7] border-transparent text-ink"
                      : "bg-white/8 border-white/15 text-[#f6f1e7] hover:bg-white/12",
                  )}
                >
                  <span className="block text-[0.9rem] font-semibold leading-tight truncate max-w-[9rem]">
                    {m.name}
                  </span>
                  <span
                    className={cn(
                      "block text-[0.78rem] font-medium tabular-nums",
                      on ? "text-ink-soft" : "text-[#f6f1e7]/60",
                    )}
                  >
                    {formatYen(bal)}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={openNewPerson}
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl border border-dashed border-white/25 px-4 py-2.5 text-[0.84rem] font-semibold text-[#f6f1e7]/80 hover:bg-white/8 transition-colors"
            >
              <UserPlus className="h-4 w-4" strokeWidth={2} />
              {t(UI.addPerson)}
            </button>
          </div>
        </div>
      </header>

      {/* ── Selected member ──────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-14 pb-28 pt-6">
        <div className="max-w-[1120px] mx-auto">
          {!selected ? (
            <div className="rounded-3xl border border-dashed border-line bg-card/60 p-10 text-center text-ink-soft">
              {t(UI.noMembers)}
            </div>
          ) : (
            <>
              {/* Balance card */}
              <div className="rounded-3xl border border-line bg-card p-5 shadow-washi">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-serif text-xl font-bold text-ink truncate">
                      {selected.name}
                    </h2>
                    <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint mt-0.5">
                      {t(UI.balanceLeft)}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={openEditPerson}
                      aria-label={t(UI.renamePerson)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft hover:border-ink-faint transition-colors"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeletePerson}
                      aria-label={t(UI.deletePerson)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line text-vermillion hover:border-vermillion hover:bg-vermillion/5 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-1 font-serif font-black tracking-tight leading-[1] tabular-nums text-[clamp(2.2rem,9vw,3.2rem)]",
                    negative ? "text-vermillion" : "text-ink",
                  )}
                >
                  {formatYen(summary.balance)}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                    <ArrowDownLeft
                      className="h-4 w-4 text-emerald-600"
                      strokeWidth={2.2}
                    />
                    <span className="text-[0.68rem] uppercase tracking-wider text-emerald-700/70">
                      {t(UI.totalIn)}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-emerald-700">
                      {formatYen(summary.totalIn)}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-vermillion/10 px-3 py-1.5">
                    <ArrowUpRight
                      className="h-4 w-4 text-vermillion"
                      strokeWidth={2.2}
                    />
                    <span className="text-[0.68rem] uppercase tracking-wider text-vermillion/70">
                      {t(UI.totalOut)}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-vermillion-deep">
                      {formatYen(summary.totalOut)}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={openNewTx}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink text-washi px-4 h-10 text-[0.82rem] font-semibold hover:bg-vermillion transition-colors"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.6} />
                    {t(UI.addTransaction)}
                  </button>
                </div>
              </div>

              {/* Transaction list */}
              {txns.length === 0 ? (
                <div className="mt-4 rounded-3xl border border-dashed border-line bg-card/60 p-8 text-center text-ink-soft">
                  {t(UI.budgetEmpty)}
                </div>
              ) : (
                <ul className="mt-4 flex flex-col gap-2">
                  {txns.map((tx, i) => {
                    const income = tx.kind === "income";
                    const meta = [
                      tx.category ? t(categoryLabel(tx.category)) : null,
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
                          onClick={() => openEditTx(tx)}
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
                              <ArrowDownLeft
                                className="h-5 w-5"
                                strokeWidth={2.2}
                              />
                            ) : (
                              <ArrowUpRight
                                className="h-5 w-5"
                                strokeWidth={2.2}
                              />
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
            </>
          )}
        </div>
      </section>

      {/* Floating add (mobile) */}
      {selected ? (
        <button
          type="button"
          onClick={openNewTx}
          aria-label={t(UI.newTransaction)}
          className="fixed right-5 z-[90] grid h-14 w-14 place-items-center rounded-full bg-vermillion text-white shadow-[0_12px_28px_-8px_rgba(192,57,43,0.6)] hover:bg-vermillion-deep transition-colors bottom-[max(env(safe-area-inset-bottom),1.25rem)] sm:hidden"
        >
          <Plus className="h-6 w-6" strokeWidth={2.6} />
        </button>
      ) : null}

      <MemberForm
        key={`m-${memberKey}`}
        open={memberOpen}
        editing={editingMember}
        onClose={() => setMemberOpen(false)}
        onSaved={() => router.refresh()}
      />

      {selected ? (
        <MemberTransactionForm
          key={`t-${txKey}`}
          open={txOpen}
          memberId={selected.id}
          editing={editingTx}
          onClose={() => setTxOpen(false)}
          onSaved={() => router.refresh()}
        />
      ) : null}
    </>
  );
}
