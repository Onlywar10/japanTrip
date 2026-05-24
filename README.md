# Kyūshū · Six-Day Itinerary

A Next.js + Tailwind + Motion site for the family's Kyūshū trip. Three sections:

- `/` — day-by-day itinerary (EN / 中文)
- `/reservations` — hotel, restaurant and activity bookings
- `/album` — shared photo album backed by Vercel Blob

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
```

## Photo album setup (Vercel Blob)

The album page uploads to and reads from a Vercel Blob store. It works locally too, as long as the env var is set.

1. **Create a Blob store**
   - Vercel dashboard → your project → **Storage** → **Create Database** → **Blob**.
   - Or via CLI: `vercel storage add blob`.

2. **Connect it to the project**
   - When you create the store from inside a project, Vercel auto-adds `BLOB_READ_WRITE_TOKEN` to that project's env vars.
   - Otherwise, copy the token from Storage → Settings → `.env.local` and paste it into Project Settings → Environment Variables.

3. **Local env**
   - Pull the env vars: `vercel env pull .env.local`
   - Or create `.env.local` manually with `BLOB_READ_WRITE_TOKEN=...`

4. **Redeploy** so the new env var is available to the running app.

Without the token, the album page renders a "storage not configured" state and the homescreen collage simply falls back to the plain dark masthead — no errors.

### How the album behaves

- **Upload**: photos go straight from the browser to Blob via a signed URL — does not hit the Vercel serverless body-size limit. JPEG / PNG / WebP / HEIC up to 25 MB each. iPhone's file picker auto-transcodes HEIC to JPEG.
- **Browse**: photos render in a responsive 2/3/4/5-column grid; tap to open a fullscreen viewer.
- **Save**: "Save All" tries the native share sheet first (`navigator.share({files})`) — on iPhone that surfaces "Save Images" → Photos app; on Android the same. If unsupported (mostly desktop), it falls back to a single ZIP download.
- **Select**: tap **Select** to enter select mode with everything pre-selected; tap tiles to deselect; **Save Selected** ships only those.
- **Delete**: available from the fullscreen viewer (calls `DELETE /api/photos`).

### Access control

The album is **open** — anyone with the URL can upload, view, and delete. That's deliberate for a family trip. The page is marked `robots: noindex` so it stays out of search engines. Treat the URL as semi-private.

If you want to lock it down later, the natural extension is a shared PIN gate (`process.env.UPLOAD_PIN`) checked in `app/api/blob/upload/route.ts`.

## Project structure

```
app/
  page.tsx                # itinerary (server, ISR 60s — pulls collage photos)
  reservations/page.tsx   # reservation cards
  album/page.tsx          # photo album
  api/
    photos/route.ts       # GET list, DELETE one
    blob/upload/route.ts  # client-upload handler
components/
  itinerary/              # topbar, masthead, day-nav, stop, info-card, planner
  reservations/           # reservation cards view
  album/                  # album-view, photo-tile, lightbox, upload-button, photo-collage
  ui/                     # shadcn-style Badge, Button, Card primitives
lib/
  itinerary.ts            # typed itinerary data + i18n labels
  reservations.ts         # reservation placeholders
  blob.ts                 # listPhotos helper + types
  photo-save.ts           # save-via-share-sheet with ZIP fallback
  utils.ts                # cn(), gmap()
```

## Deploy

Push to GitHub then import the repo in Vercel — or run `vercel` from this folder. Make sure the Blob store is connected to the project before sharing the URL.
