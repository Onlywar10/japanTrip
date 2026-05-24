"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCheck, Download, Loader2, Sparkles } from "lucide-react";
import type { Photo } from "@/lib/blob";
import { UI } from "@/lib/itinerary";
import { useLanguage } from "@/components/itinerary/language-provider";
import { savePhotos } from "@/lib/photo-save";
import { cn } from "@/lib/utils";
import { UploadButton } from "./upload-button";
import { PhotoTile } from "./photo-tile";
import { Lightbox } from "./lightbox";

interface ApiResponse {
  photos: Photo[];
  configured: boolean;
}

export function AlbumView() {
  const { t, lang } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewing, setViewing] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      const data = (await res.json()) as ApiResponse;
      setPhotos(data.photos ?? []);
      setConfigured(data.configured ?? false);
    } catch (err) {
      console.error(err);
      setConfigured(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const allSelected = photos.length > 0 && selected.size === photos.length;

  const enterSelectMode = useCallback(() => {
    setSelectMode(true);
    setSelected(new Set(photos.map((p) => p.url)));
  }, [photos]);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelected(new Set());
  }, []);

  const toggleSelect = useCallback((url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === photos.length) return new Set();
      return new Set(photos.map((p) => p.url));
    });
  }, [photos]);

  const handleSave = useCallback(
    async (subset: Photo[]) => {
      if (subset.length === 0) return;
      setSaving(true);
      try {
        const result = await savePhotos(subset);
        if (result.kind === "shared") setToast(t(UI.sharedViaSheet));
        else if (result.kind !== "cancelled") setToast(t(UI.saved));
      } catch (err) {
        console.error(err);
        setToast(t(UI.saveError));
      } finally {
        setSaving(false);
        if (selectMode) exitSelectMode();
      }
    },
    [exitSelectMode, selectMode, t]
  );

  const handleDelete = useCallback(
    async (p: Photo) => {
      const prev = photos;
      setPhotos(prev.filter((x) => x.url !== p.url));
      setViewing(null);
      try {
        const res = await fetch("/api/photos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: p.url }),
        });
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        console.error(err);
        setPhotos(prev);
        setToast(t(UI.saveError));
      }
    },
    [photos, t]
  );

  const selectedPhotos = useMemo(
    () => photos.filter((p) => selected.has(p.url)),
    [photos, selected]
  );

  const photoWord =
    photos.length === 1 ? t(UI.photoCount[lang].one) : t(UI.photoCount[lang].many);

  return (
    <>
      <header className="relative overflow-hidden bg-ink text-washi rounded-b-[26px] px-4 sm:px-8 lg:px-14 pt-24 pb-9">
        <span
          aria-hidden
          className="absolute right-[-3%] top-1/2 -translate-y-1/2 font-serif font-black select-none pointer-events-none text-[clamp(11rem,26vw,24rem)] leading-[0.8] text-white/5 z-0"
        >
          相簿
        </span>

        <div className="relative z-[1] max-w-[1120px] mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 text-[0.7rem] tracking-[0.36em] uppercase text-[#e08a72] font-semibold mb-4 before:content-[''] before:w-9 before:h-px before:bg-[#e08a72]"
          >
            {t(UI.tabAlbum)}
          </motion.span>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex-1 min-w-[260px]">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif font-black text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1] tracking-tight text-[#f6f1e7]"
              >
                {t(UI.albumTitle)}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="mt-3 text-[0.92rem] text-[#f6f1e7]/70 max-w-2xl"
              >
                {t(UI.albumSub)}
              </motion.p>
              <p className="mt-2 text-[0.75rem] text-[#f6f1e7]/45">
                {t(UI.uploadHint)}
              </p>
            </div>
            {configured ? (
              <UploadButton onUploaded={fetchPhotos} />
            ) : null}
          </div>
        </div>
      </header>

      <section className="px-4 sm:px-8 lg:px-14 pb-24 pt-6">
        <div className="max-w-[1120px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-ink-soft">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ...
            </div>
          ) : configured === false ? (
            <div className="rounded-3xl border border-dashed border-line bg-card/60 p-8 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-gold mb-3" strokeWidth={1.6} />
              <p className="text-ink-soft">{t(UI.albumNotConfigured)}</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-card/60 p-12 text-center text-ink-soft">
              {t(UI.albumEmpty)}
            </div>
          ) : (
            <>
              <div className="sticky top-[58px] z-40 -mx-4 sm:-mx-8 lg:-mx-14 px-4 sm:px-8 lg:px-14 py-3 bg-washi/95 backdrop-blur-sm border-b border-line/60 flex items-center justify-between gap-3 mb-5">
                <div className="text-[0.84rem] text-ink-soft">
                  {selectMode ? (
                    <>
                      <b className="font-semibold text-ink">{selected.size}</b>{" "}
                      / {photos.length} {t(UI.selectedCount)}
                    </>
                  ) : (
                    <>
                      <b className="font-semibold text-ink">{photos.length}</b>{" "}
                      {photoWord}
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {selectMode ? (
                    <>
                      <button
                        type="button"
                        onClick={toggleAll}
                        className="inline-flex items-center gap-1.5 rounded-full bg-washi text-ink border border-line px-3.5 py-2 text-[0.78rem] font-medium hover:border-ink transition-colors"
                      >
                        <CheckCheck className="h-4 w-4" strokeWidth={1.8} />
                        {allSelected ? t(UI.clear) : t(UI.selectAll)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(selectedPhotos)}
                        disabled={saving || selected.size === 0}
                        className="inline-flex items-center gap-1.5 rounded-full bg-vermillion text-washi px-3.5 py-2 text-[0.78rem] font-semibold hover:bg-vermillion-deep transition-colors disabled:opacity-60"
                      >
                        <Download className="h-4 w-4" strokeWidth={2} />
                        {saving ? t(UI.preparingDownload) : `${t(UI.saveSelected)} (${selected.size})`}
                      </button>
                      <button
                        type="button"
                        onClick={exitSelectMode}
                        className="inline-flex items-center gap-1.5 rounded-full bg-transparent text-ink-soft px-3 py-2 text-[0.78rem] font-medium hover:text-ink"
                      >
                        {t(UI.cancel)}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={enterSelectMode}
                        className="inline-flex items-center gap-1.5 rounded-full bg-washi text-ink border border-line px-3.5 py-2 text-[0.78rem] font-medium hover:border-ink transition-colors"
                      >
                        <CheckCheck className="h-4 w-4" strokeWidth={1.8} />
                        {t(UI.select)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(photos)}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-full bg-vermillion text-washi px-3.5 py-2 text-[0.78rem] font-semibold hover:bg-vermillion-deep transition-colors disabled:opacity-60"
                      >
                        <Download className="h-4 w-4" strokeWidth={2} />
                        {saving ? t(UI.preparingDownload) : t(UI.saveAll)}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                {photos.map((p, i) => (
                  <PhotoTile
                    key={p.url}
                    photo={p}
                    index={i}
                    selectMode={selectMode}
                    selected={selected.has(p.url)}
                    onToggle={() => toggleSelect(p.url)}
                    onOpen={() => setViewing(p)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Lightbox
        photo={viewing}
        onClose={() => setViewing(null)}
        onSave={(p) => handleSave([p])}
        onDelete={configured ? handleDelete : undefined}
        saving={saving}
      />

      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 -translate-x-1/2 bottom-[max(env(safe-area-inset-bottom),1rem)] z-[150] rounded-full bg-ink text-washi px-5 py-2.5 text-[0.84rem] shadow-2xl"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
