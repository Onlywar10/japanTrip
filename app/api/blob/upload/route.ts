import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  PHOTO_PREFIX,
} from "@/lib/blob";

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage is not configured on the server." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(PHOTO_PREFIX)) {
          throw new Error(`Uploads must be inside ${PHOTO_PREFIX}`);
        }
        return {
          allowedContentTypes: ALLOWED_IMAGE_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[blob] upload completed", blob.pathname, blob.url);
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[blob] handleUpload error", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
