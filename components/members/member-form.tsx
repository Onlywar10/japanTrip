"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";

import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";
import type { MemberAccount } from "@/lib/budget-format";
import { addMember, renameMember } from "@/lib/member-actions";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  /** Provided when renaming; null when adding a new person. */
  editing: MemberAccount | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MemberForm({ open, editing, onClose, onSaved }: Props) {
  const { t } = useLanguage();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(editing?.name ?? "");
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
    if (!name.trim()) {
      setError(t(UI.nameRequired));
      return;
    }
    startTransition(async () => {
      const res = editing
        ? await renameMember(editing.id, name.trim())
        : await addMember(name.trim());
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="member-backdrop"
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
            key="member-sheet"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-washi border border-line rounded-t-3xl sm:rounded-3xl shadow-washi flex flex-col overflow-hidden"
          >
            <div className="sm:hidden pt-2.5 flex justify-center">
              <span className="h-1.5 w-10 rounded-full bg-line" />
            </div>

            <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-line/70">
              <h2 className="font-serif text-lg font-bold text-ink">
                {editing ? t(UI.editPerson) : t(UI.newPerson)}
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
              className="flex flex-col gap-4 px-5 py-4"
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {t(UI.personName)}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="—"
                  autoFocus
                  className="w-full h-12 rounded-xl border border-line bg-card px-3.5 text-base text-ink placeholder:text-ink-faint/60 focus:outline-none focus:border-ink focus:ring-2 focus:ring-vermillion/20 transition"
                />
              </label>

              {error ? (
                <p className="rounded-xl bg-vermillion/10 px-3.5 py-2.5 text-sm text-vermillion-deep">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className={cn(
                  "flex h-12 items-center justify-center gap-2 rounded-xl bg-ink text-washi text-sm font-semibold hover:bg-vermillion transition-colors disabled:opacity-60",
                  "pb-[max(env(safe-area-inset-bottom),0)]",
                )}
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
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
