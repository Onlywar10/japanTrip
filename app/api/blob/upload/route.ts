import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import type { NextRequest } from "next/server";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  PHOTO_PREFIX,
} from "@/lib/blob";

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  const jsonResponse = await handleUpload({
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
    // No onUploadCompleted: we don't persist anything server-side (the gallery
    // re-lists from Blob via listPhotos). Defining it would register a
    // server-to-server callback URL that the Blob service must reach for the
    // upload to "complete" — which stalls/retries on localhost (unreachable)
    // and on protected preview deployments. See @vercel/blob client.js getCallbackUrl.
  });

  return Response.json(jsonResponse);
}
