"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { upload } from "@vercel/blob/client";
import { PHOTO_PREFIX } from "@/lib/blob";
import { useLanguage } from "@/components/itinerary/language-provider";
import { UI } from "@/lib/itinerary";
import { cn } from "@/lib/utils";

interface Props {
  disabled?: boolean;
  onUploaded?: () => void;
}

type FileState = "pending" | "uploading" | "done" | "error";

interface Item {
  id: string;
  name: string;
  size: number;
  state: FileState;
  loaded: number;
  total: number;
  error?: string;
}

const PER_FILE_TIMEOUT_MS = 90_000;

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  gif: "image/gif",
  avif: "image/avif",
};

function guessMime(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return (ext && EXT_TO_MIME[ext]) || "application/octet-stream";
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadButton({ disabled, onUploaded }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  function updateItem(id: string, patch: Partial<Item>) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  }

  async function uploadOne(item: Item, file: File): Promise<void> {
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const stamp = Date.now();
    const path = `${PHOTO_PREFIX}${stamp}-${safe}`;
    const contentType = guessMime(file);

    updateItem(item.id, {
      state: "uploading",
      loaded: 0,
      total: file.size,
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PER_FILE_TIMEOUT_MS);

    try {
      await upload(path, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        contentType,
        abortSignal: controller.signal,
        onUploadProgress: ({ loaded, total }) => {
          updateItem(item.id, { loaded, total });
        },
      });
      updateItem(item.id, {
        state: "done",
        loaded: file.size,
        total: file.size,
      });
    } catch (err) {
      const aborted = controller.signal.aborted;
      const msg = aborted
        ? `Timed out after ${PER_FILE_TIMEOUT_MS / 1000}s`
        : err instanceof Error
          ? err.message
          : "Upload failed";
      updateItem(item.id, { state: "error", error: msg });
      console.error("[upload] failed", file.name, err);
    } finally {
      clearTimeout(timer);
    }
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const initial: Item[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}-${f.name}`,
      name: f.name,
      size: f.size,
      state: "pending",
      loaded: 0,
      total: f.size,
    }));
    setItems(initial);
    setPanelOpen(true);
    setBusy(true);

    try {
      let anySucceeded = false;
      for (let i = 0; i < files.length; i += 1) {
        await uploadOne(initial[i], files[i]);
        const latest = await new Promise<Item | undefined>((resolve) => {
          setItems((prev) => {
            resolve(prev.find((it) => it.id === initial[i].id));
            return prev;
          });
        });
        if (latest?.state === "done") anySucceeded = true;
      }
      if (anySucceeded) onUploaded?.();
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const doneCount = items.filter((i) => i.state === "done").length;
  const errCount = items.filter((i) => i.state === "error").length;
  const total = items.length;

  return (
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.82rem] font-semibold tracking-wide transition-colors",
          "bg-vermillion text-washi hover:bg-vermillion-deep disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            {t(UI.uploading)} {doneCount}/{total}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" strokeWidth={2} />
            {t(UI.upload)}
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <AnimatePresence>
        {panelOpen && items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-[22rem] max-h-72 overflow-y-auto rounded-2xl border border-line bg-card shadow-xl text-ink"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-line/70 text-[0.78rem] sticky top-0 bg-card">
              <span>
                <b>{doneCount}</b>/{total} done
                {errCount > 0 ? (
                  <span className="text-vermillion-deep ml-2">
                    · {errCount} failed
                  </span>
                ) : null}
              </span>
              {!busy ? (
                <button
                  type="button"
                  onClick={() => {
                    setPanelOpen(false);
                    setItems([]);
                  }}
                  className="p-1 rounded-full hover:bg-washi-2"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" strokeWidth={1.8} />
                </button>
              ) : null}
            </div>
            <ul className="divide-y divide-line/60">
              {items.map((it) => {
                const pct =
                  it.state === "done"
                    ? 100
                    : it.total > 0
                      ? Math.min(100, Math.round((it.loaded / it.total) * 100))
                      : 0;
                return (
                  <li key={it.id} className="px-3 py-2 text-[0.76rem]">
                    <div className="flex items-center gap-2">
                      <StateIcon state={it.state} />
                      <span className="flex-1 truncate" title={it.name}>
                        {it.name}
                      </span>
                      <span className="text-ink-faint shrink-0">
                        {fmtBytes(it.size)}
                      </span>
                    </div>
                    {it.state === "uploading" || it.state === "done" ? (
                      <div className="mt-1 h-1 w-full rounded-full bg-washi-2 overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-[width] duration-200",
                            it.state === "done" ? "bg-[#1f6b3a]" : "bg-vermillion"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    ) : null}
                    {it.error ? (
                      <div className="mt-1 text-vermillion-deep">
                        {it.error}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function StateIcon({ state }: { state: FileState }) {
  if (state === "uploading")
    return <Loader2 className="h-3.5 w-3.5 animate-spin text-vermillion shrink-0" />;
  if (state === "done")
    return <CheckCircle2 className="h-3.5 w-3.5 text-[#1f6b3a] shrink-0" />;
  if (state === "error")
    return <AlertTriangle className="h-3.5 w-3.5 text-vermillion-deep shrink-0" />;
  return <span className="h-3.5 w-3.5 rounded-full border border-line shrink-0" />;
}
