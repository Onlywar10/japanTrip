"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { PHOTO_PREFIX } from "@/lib/blob";
import { useLanguage } from "@/components/itinerary/language-provider";
import { UI } from "@/lib/itinerary";
import { cn } from "@/lib/utils";

interface Props {
  disabled?: boolean;
  onUploaded?: () => void;
}

export function UploadButton({ disabled, onUploaded }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setError(null);
    setProgress({ done: 0, total: files.length });

    let done = 0;
    try {
      for (const file of files) {
        const safe = file.name.replace(/[^\w.\-]+/g, "_");
        const stamp = Date.now();
        const path = `${PHOTO_PREFIX}${stamp}-${safe}`;
        await upload(path, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          contentType: file.type || undefined,
        });
        done += 1;
        setProgress({ done, total: files.length });
      }
      onUploaded?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = progress !== null;

  return (
    <div className="flex flex-col items-end gap-1.5">
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
            {t(UI.uploading)} {progress!.done}/{progress!.total}
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
      {error ? (
        <span className="text-[0.74rem] text-vermillion-deep max-w-xs text-right">
          {error}
        </span>
      ) : null}
    </div>
  );
}
