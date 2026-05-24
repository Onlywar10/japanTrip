import { list, type ListBlobResult } from "@vercel/blob";

export const PHOTO_PREFIX = "photos/";
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/avif",
];
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export interface Photo {
  url: string;
  pathname: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

function toPhoto(b: ListBlobResult["blobs"][number]): Photo {
  const filename =
    decodeURIComponent(b.pathname.split("/").pop() ?? b.pathname) || "photo";
  return {
    url: b.url,
    pathname: b.pathname,
    filename,
    size: b.size,
    uploadedAt:
      b.uploadedAt instanceof Date ? b.uploadedAt.toISOString() : String(b.uploadedAt),
  };
}

export async function listPhotos(limit = 200): Promise<Photo[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return [];
  }
  try {
    const { blobs } = await list({
      prefix: PHOTO_PREFIX,
      limit,
      // Force the read-write token. The SDK otherwise prefers OIDC whenever
      // VERCEL_OIDC_TOKEN + BLOB_STORE_ID are present (auto-injected on Vercel),
      // which throws when OIDC isn't enabled for the current environment.
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blobs
      .map(toPhoto)
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
  } catch (err) {
    console.error("[blob] listPhotos failed", err);
    return [];
  }
}
