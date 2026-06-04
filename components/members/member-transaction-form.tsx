"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Trash2, X } from "lucide-react";

import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";
import {
  CATEGORIES,
  type AccountTransaction,
  type TransactionKind,
} from "@/lib/budget-format";
import {
  addMemberTransaction,
  deleteMemberTransaction,
  updateMemberTransaction,
} from "@/lib/member-actions";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  memberId: string;
  /** Provided when editing an existing entry; null when adding a new one. */
  editing: AccountTransaction | null;
  onClose: () => void;
  onSaved: () => void;
}

function todayISODate(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10);
}

export function MemberTransactionForm({
  open,
  memberId,
  editing,
  onClose,
  onSaved,
}: Props) {
  const { t } = useLanguage();
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();

  // Seeded from props via lazy initializers; the parent remounts (via `key`)
  // on every open so these run fresh each session — no syncing effect needed.
  const [kind, setKind] = useState<TransactionKind>(editing?.kind ?? "expense");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [category, setCategory] = useState<string | null>(
    editing?.category ?? null,
  );
  const [date, setDate] = useState(
    editing ? editing.occurredAt.slice(0, 10) : todayISODate(),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numeric = Math.round(Number(amount));
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError(t(UI.amountRequired));
      return;
    }
    if (!description.trim()) {
      setError(t(UI.descriptionRequired));
      return;
    }

    const payload = {
      kind,
      amount: numeric,
      description: description.trim(),
      category,
      occurredAt: new Date(`${date}T12:00:00`).toISOString(),
    };

    startTransition(async () => {
      const res = editing
        ? await updateMemberTransaction(editing.id, payload)
        : await addMemberTransaction(memberId, payload);
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        setError(res.error);
      }
    });
  }

  function handleDelete() {
    if (!editing) return;
    if (!confirm(t(UI.confirmDeleteTx))) return;
    startDelete(async () => {
      const res = await deleteMemberTransaction(editing.id);
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        setError(res.error);
      }
    });
  }

  const inputClass =
    "w-full h-12 rounded-xl border border-line bg-card px-3.5 text-base text-ink placeholder:text-ink-faint/60 focus:outline-none focus:border-ink focus:ring-2 focus:ring-vermillion/20 transition";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mtx-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="mtx-sheet"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-washi border border-line rounded-t-3xl sm:rounded-3xl shadow-washi flex flex-col max-h-[92dvh] overflow-hidden"
          >
            <div className="sm:hidden pt-2.5 flex justify-center">
              <span className="h-1.5 w-10 rounded-full bg-line" />
            </div>

            <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-line/70">
              <h2 className="font-serif text-lg font-bold text-ink">
                {editing ? t(UI.editTransaction) : t(UI.newTransaction)}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t(UI.cancel)}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-washi-2 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 px-5 py-4 overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-washi-2 p-1">
                {(
                  [
                    { v: "expense", label: t(UI.kindExpense) },
                    { v: "income", label: t(UI.kindIncome) },
                  ] as const
                ).map((opt) => {
                  const on = kind === opt.v;
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setKind(opt.v)}
                      className={cn(
                        "h-11 rounded-xl text-sm font-semibold transition-colors",
                        on
                          ? opt.v === "income"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-ink text-washi shadow-sm"
                          : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {t(UI.fieldAmount)}
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-semibold text-ink-soft">
                    ¥
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="0"
                    autoFocus={!editing}
                    className={cn(inputClass, "h-14 pl-9 text-2xl font-bold")}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {t(UI.fieldDescription)}
                </span>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    kind === "income" ? "Pocket money" : "Souvenir / snack"
                  }
                  className={inputClass}
                />
              </label>

              <div>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {t(UI.fieldCategory)}{" "}
                  <span className="font-normal lowercase tracking-normal text-ink-faint/70">
                    · {t(UI.optional)}
                  </span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const on = category === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(on ? null : c.value)}
                        className={cn(
                          "h-9 rounded-full border px-3.5 text-[0.82rem] font-medium transition-colors",
                          on
                            ? "border-ink bg-ink text-washi"
                            : "border-line bg-card text-ink-soft hover:border-ink-faint",
                        )}
                      >
                        {t(c.label)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {t(UI.fieldDate)}
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={cn(inputClass, "appearance-none")}
                />
              </label>

              {error ? (
                <p className="rounded-xl bg-vermillion/10 px-3.5 py-2.5 text-sm text-vermillion-deep">
                  {error}
                </p>
              ) : null}
            </form>

            <div className="flex items-center gap-3 border-t border-line/70 px-5 py-3.5 pb-[max(env(safe-area-inset-bottom),0.875rem)]">
              {editing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || pending}
                  aria-label={t(UI.delete)}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line text-vermillion hover:border-vermillion hover:bg-vermillion/5 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" strokeWidth={1.8} />
                  )}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={pending || deleting}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-ink text-washi text-sm font-semibold hover:bg-vermillion transition-colors disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t(UI.saving)}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" strokeWidth={2.4} />
                    {t(UI.save)}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
