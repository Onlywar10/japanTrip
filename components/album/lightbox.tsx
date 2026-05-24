"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Trash2, X } from "lucide-react";
import type { Photo } from "@/lib/blob";
import { useLanguage } from "@/components/itinerary/language-provider";
import { UI } from "@/lib/itinerary";

interface Props {
  photo: Photo | null;
  onClose: () => void;
  onSave: (p: Photo) => void;
  onDelete?: (p: Photo) => void;
  saving?: boolean;
}

export function Lightbox({ photo, onClose, onSave, onDelete, saving }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (photo) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [photo, onClose]);

  return (
    <AnimatePresence>
      {photo ? (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex flex-col"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-end gap-2 px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-2">
            {onDelete ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(t(UI.confirmDelete))) onDelete(photo);
                }}
                aria-label={t(UI.deletePhoto)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              >
                <Trash2 className="h-5 w-5" strokeWidth={1.8} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSave(photo);
              }}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-vermillion text-white px-4 h-10 text-[0.82rem] font-semibold hover:bg-vermillion-deep transition-colors disabled:opacity-60"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              {saving ? t(UI.preparingDownload) : t(UI.saveAll)}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label={t(UI.closeViewer)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>

          <motion.div
            key={photo.url}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex items-center justify-center min-h-0 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            {}
            <img
              src={photo.url}
              alt={photo.filename}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
