import { NextResponse } from "next/server";
import { listPhotos } from "@/lib/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  const photos = await listPhotos();
  return NextResponse.json(
    { photos, configured: Boolean(process.env.BLOB_READ_WRITE_TOKEN) },
    {
      headers: {
        "Cache-Control": "public, max-age=15, s-maxage=15, stale-while-revalidate=60",
      },
    }
  );
}

export async function DELETE(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage is not configured" },
      { status: 503 }
    );
  }

  const { url } = (await request.json()) as { url?: string };
  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const { del } = await import("@vercel/blob");
  try {
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[blob] delete failed", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
