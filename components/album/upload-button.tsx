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
  progressEvents: number;
  error?: string;
}

interface LogEntry {
  t: number;
  level: "info" | "warn" | "error";
  msg: string;
}

const PER_FILE_TIMEOUT_MS = 90_000;
const MAX_LOG_LINES = 80;

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtTime(t: number) {
  const d = new Date(t);
  return `${d.toLocaleTimeString([], { hour12: false })}.${String(d.getMilliseconds()).padStart(3, "0")}`;
}

export function UploadButton({ disabled, onUploaded }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true);

  function appendLog(level: LogEntry["level"], msg: string) {
    const entry = { t: Date.now(), level, msg };
    // also mirror to console so desktop devs see it too
    if (level === "error") console.error("[upload]", msg);
    else if (level === "warn") console.warn("[upload]", msg);
    else console.log("[upload]", msg);
    setLogs((prev) => {
      const next = [...prev, entry];
      return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next;
    });
  }

  function updateItem(id: string, patch: Partial<Item>) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  }

  async function uploadOne(item: Item, file: File): Promise<void> {
    // Match the working MBV pattern: pass file.name directly under the
    // PHOTO_PREFIX folder and let `addRandomSuffix` on the server handle
    // collisions. Don't override the SDK's content-type derivation.
    const path = `${PHOTO_PREFIX}${file.name}`;

    appendLog(
      "info",
      `START ${file.name} (${fmtBytes(file.size)}, type="${file.type || "<empty>"}")`
    );

    updateItem(item.id, {
      state: "uploading",
      loaded: 0,
      total: file.size,
      progressEvents: 0,
    });

    const controller = new AbortController();
    const timer = setTimeout(() => {
      appendLog("warn", `TIMEOUT ${file.name} after ${PER_FILE_TIMEOUT_MS / 1000}s`);
      controller.abort();
    }, PER_FILE_TIMEOUT_MS);

    let lastLoggedPct = -1;
    let prevLoaded = 0;
    let progressCount = 0;

    try {
      const result = await upload(path, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        abortSignal: controller.signal,
        onUploadProgress: ({ loaded, total, percentage }) => {
          progressCount += 1;
          updateItem(item.id, { loaded, total, progressEvents: progressCount });
          // Detect retry: progress regressed from a high % back to ~0
          if (lastLoggedPct >= 80 && percentage < 20) {
            appendLog(
              "warn",
              `RESET ${file.name} loaded ${prevLoaded}→${loaded} (SDK appears to be retrying)`
            );
          }
          const pct = Math.round(percentage);
          if (pct === 0 || pct === 100 || pct - lastLoggedPct >= 25) {
            appendLog(
              "info",
              `PROGRESS ${file.name} ${pct}% (${fmtBytes(loaded)}/${fmtBytes(total)}, ev#${progressCount})`
            );
            lastLoggedPct = pct;
          }
          prevLoaded = loaded;
        },
      });
      appendLog(
        "info",
        `DONE ${file.name} → ${result.url} (events=${progressCount})`
      );
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
          ? `${err.name}: ${err.message}`
          : "Upload failed";
      appendLog("error", `FAIL ${file.name}: ${msg}`);
      updateItem(item.id, { state: "error", error: msg });
    } finally {
      clearTimeout(timer);
    }
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    appendLog(
      "info",
      `BATCH START ${files.length} file${files.length === 1 ? "" : "s"}`
    );
    const initial: Item[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}-${f.name}`,
      name: f.name,
      size: f.size,
      state: "pending",
      loaded: 0,
      total: f.size,
      progressEvents: 0,
    }));
    setItems(initial);
    setPanelOpen(true);
    setBusy(true);

    try {
      let succeeded = 0;
      for (let i = 0; i < files.length; i += 1) {
        await uploadOne(initial[i], files[i]);
        const latest = await new Promise<Item | undefined>((resolve) => {
          setItems((prev) => {
            resolve(prev.find((it) => it.id === initial[i].id));
            return prev;
          });
        });
        if (latest?.state === "done") succeeded += 1;
      }
      appendLog(
        "info",
        `BATCH END ${succeeded}/${files.length} succeeded`
      );
      if (succeeded > 0) onUploaded?.();
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function copyLogs() {
    const text = logs
      .map(
        (l) =>
          `${fmtTime(l.t)} ${l.level.toUpperCase().padEnd(5)} ${l.msg}`
      )
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      appendLog("info", "Logs copied to clipboard");
    } catch {
      appendLog("warn", "Clipboard copy failed");
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
            className="w-full sm:w-[24rem] max-h-[60vh] overflow-y-auto rounded-2xl border border-line bg-card shadow-xl text-ink"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-line/70 text-[0.78rem] sticky top-0 bg-card z-10">
              <span>
                <b>{doneCount}</b>/{total} done
                {errCount > 0 ? (
                  <span className="text-vermillion-deep ml-2">
                    · {errCount} failed
                  </span>
                ) : null}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogs((s) => !s)}
                  className="text-[0.72rem] underline decoration-dotted text-ink-soft hover:text-ink"
                >
                  {showLogs ? "Hide logs" : "Show logs"}
                </button>
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
                      <span className="text-ink-faint shrink-0 tabular-nums">
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
                    {it.progressEvents > 0 ? (
                      <div className="mt-0.5 text-[0.66rem] text-ink-faint">
                        progress events: {it.progressEvents}
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

            {showLogs && logs.length > 0 ? (
              <div className="border-t border-line/70 bg-washi/60">
                <div className="flex items-center justify-between px-3 py-1.5 text-[0.66rem] uppercase tracking-wider text-ink-faint">
                  <span>Debug log ({logs.length})</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyLogs}
                      className="underline decoration-dotted hover:text-ink"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogs([])}
                      className="underline decoration-dotted hover:text-ink"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <pre className="px-3 pb-2 text-[0.66rem] leading-snug font-mono whitespace-pre-wrap break-words text-ink-soft max-h-64 overflow-y-auto">
                  {logs
                    .map(
                      (l) =>
                        `${fmtTime(l.t)} ${l.level === "error" ? "❌" : l.level === "warn" ? "⚠" : "·"} ${l.msg}`
                    )
                    .join("\n")}
                </pre>
              </div>
            ) : null}
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
