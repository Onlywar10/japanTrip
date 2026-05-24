import type { Photo } from "./blob";

type SaveOutcome =
  | { kind: "shared" }
  | { kind: "downloaded-single"; filename: string }
  | { kind: "downloaded-zip"; filename: string }
  | { kind: "cancelled" };

interface FetchedFile {
  file: File;
  blob: Blob;
  source: Photo;
}

async function fetchFiles(photos: Photo[]): Promise<FetchedFile[]> {
  return Promise.all(
    photos.map(async (p) => {
      const res = await fetch(p.url, { mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to download ${p.filename}`);
      const blob = await res.blob();
      const type = blob.type || "image/jpeg";
      const file = new File([blob], p.filename, { type });
      return { file, blob, source: p };
    })
  );
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function downloadZip(files: FetchedFile[]): Promise<SaveOutcome> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const f of files) {
    zip.file(f.source.filename, f.blob);
  }
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `kyushu-photos-${stamp}.zip`;
  const url = URL.createObjectURL(zipBlob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return { kind: "downloaded-zip", filename };
}

export async function savePhotos(photos: Photo[]): Promise<SaveOutcome> {
  if (photos.length === 0) return { kind: "cancelled" };

  if (photos.length === 1) {
    try {
      const [{ file, source }] = await fetchFiles(photos);
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({ files: [file], title: source.filename });
          return { kind: "shared" };
        } catch (err) {
          if ((err as DOMException)?.name === "AbortError") {
            return { kind: "cancelled" };
          }
        }
      }
      const objectUrl = URL.createObjectURL(file);
      triggerDownload(objectUrl, source.filename);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
      return { kind: "downloaded-single", filename: source.filename };
    } catch {
      triggerDownload(photos[0].url, photos[0].filename);
      return { kind: "downloaded-single", filename: photos[0].filename };
    }
  }

  const files = await fetchFiles(photos);

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function"
  ) {
    const fileList = files.map((f) => f.file);
    if (navigator.canShare({ files: fileList })) {
      try {
        await navigator.share({
          files: fileList,
          title: `${photos.length} Kyūshū photos`,
        });
        return { kind: "shared" };
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") {
          return { kind: "cancelled" };
        }
      }
    }
  }

  return downloadZip(files);
}
