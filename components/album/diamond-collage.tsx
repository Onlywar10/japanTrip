"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Photo } from "@/lib/blob";

const SWAP_INTERVAL_MS = 2800;
const COS = Math.SQRT1_2; // cos/sin of 45°
const ASPECT = 6 / 5; // container height / width (portrait)
const GRID = 1.62; // grid square side, in container-width units (>1 so it overflows & clips)

interface Tile {
  x: number; // top-left, fraction of grid
  y: number;
  s: number; // size, fraction of grid
}

interface Breakpoint {
  max: number; // target tile count
  minS: number; // smallest allowed tile
}

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>({ max: 30, minS: 1 / 16 });
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 480) setBp({ max: 11, minS: 1 / 8 });
      else if (w < 1024) setBp({ max: 18, minS: 1 / 8 });
      else setBp({ max: 30, minS: 1 / 16 });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return bp;
}

/** Screen-space offset of a grid point from the container center (width units). */
function toScreen(gx: number, gy: number): [number, number] {
  const dx = (gx - 0.5) * GRID;
  const dy = (gy - 0.5) * GRID;
  return [(dx - dy) * COS, (dx + dy) * COS]; // rotate 45°
}

/** Does the tile (after rotation) overlap the visible rectangle at all? */
function visible(t: Tile): boolean {
  const [ox, oy] = toScreen(t.x + t.s / 2, t.y + t.s / 2);
  const margin = t.s * GRID * COS;
  return Math.abs(ox) <= 0.5 + margin && Math.abs(oy) <= ASPECT / 2 + margin;
}

function pickByArea(tiles: Tile[]): Tile {
  const weights = tiles.map((t) => t.s * t.s);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < tiles.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return tiles[i];
  }
  return tiles[tiles.length - 1];
}

/**
 * Quadtree subdivision: start from one tile covering the grid and repeatedly
 * split a (larger, visible) tile into four until enough tiles fall inside the
 * visible rectangle. Splitting keeps everything edge-adjacent and gap-free, the
 * mixed depths give varied sizes, and rotation turns each square into a diamond.
 */
function buildTiles(target: number, minS: number): Tile[] {
  let tiles: Tile[] = [{ x: 0, y: 0, s: 1 }];
  const visibleCount = () => tiles.reduce((n, t) => n + (visible(t) ? 1 : 0), 0);

  let guard = 0;
  while (visibleCount() < target && guard < 600) {
    guard += 1;
    const splittable = tiles.filter((t) => t.s > minS + 1e-9);
    if (splittable.length === 0) break;
    const preferred = splittable.filter(visible);
    const pick = pickByArea(preferred.length ? preferred : splittable);
    const h = pick.s / 2;
    tiles = tiles.filter((t) => t !== pick);
    tiles.push(
      { x: pick.x, y: pick.y, s: h },
      { x: pick.x + h, y: pick.y, s: h },
      { x: pick.x, y: pick.y + h, s: h },
      { x: pick.x + h, y: pick.y + h, s: h }
    );
  }

  // Keep only tiles touching the frame, then trim to the target, dropping the
  // smallest / most peripheral first so edges stay pleasantly ragged.
  let vis = tiles.filter(visible);
  if (vis.length > target) {
    vis = vis
      .map((t) => {
        const [ox, oy] = toScreen(t.x + t.s / 2, t.y + t.s / 2);
        return { t, score: t.s - (Math.abs(ox) + Math.abs(oy)) * 0.18 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, target)
      .map((e) => e.t);
  }
  return vis;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function DiamondCollage() {
  const [pool, setPool] = useState<Photo[]>([]);
  const [assign, setAssign] = useState<Photo[]>([]);
  const bp = useBreakpoint();

  // Fetch the photo pool once. Decorative: failures are silently ignored.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/photos", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { photos?: Photo[] };
        if (!cancelled) setPool(data.photos ?? []);
      } catch {
        // no-op
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Layout: as many tiles as we have photos (no repeats), capped per breakpoint.
  const target = Math.min(pool.length, bp.max);
  const layout = useMemo(
    () => (target > 0 ? buildTiles(target, bp.minS) : []),
    [target, bp.minS]
  );

  // Assign one distinct photo per tile.
  useEffect(() => {
    if (pool.length === 0 || layout.length === 0) {
      setAssign([]);
      return;
    }
    const shuffled = shuffle(pool);
    setAssign(layout.map((_, i) => shuffled[i]));
  }, [pool, layout]);

  // Cross-fade one random tile to a photo not currently shown, on an interval.
  const poolRef = useRef(pool);
  poolRef.current = pool;
  useEffect(() => {
    const id = setInterval(() => {
      setAssign((cur) => {
        if (cur.length === 0) return cur;
        const shown = new Set(cur.map((p) => p.url));
        const fresh = poolRef.current.filter((p) => !shown.has(p.url));
        if (fresh.length === 0) return cur;
        const next = [...cur];
        next[Math.floor(Math.random() * next.length)] =
          fresh[Math.floor(Math.random() * fresh.length)];
        return next;
      });
    }, SWAP_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (assign.length === 0) return null;

  return (
    <section className="relative px-4 pb-24 pt-2 sm:pb-28">
      {/* warm glow behind the mosaic */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vw] max-h-[34rem] w-[80vw] max-w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(192,57,43,0.18), rgba(176,133,52,0.12) 45%, transparent 70%)",
        }}
      />

      <motion.div
        aria-hidden
        className="relative mx-auto aspect-[5/6] overflow-hidden rounded-2xl"
        style={{ width: "min(90vw, 26rem)" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Rotated grid, larger than the frame so its diamonds fill it edge to
            edge; the frame's overflow-hidden clips boundary tiles into wedges. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"
          style={{ width: `${GRID * 100}%`, aspectRatio: "1" }}
        >
          {layout.map((tile, i) => {
            const photo = assign[i];
            if (!photo) return null;
            const [ox, oy] = toScreen(tile.x + tile.s / 2, tile.y + tile.s / 2);
            return (
              <DiamondTile
                key={`${tile.x.toFixed(4)}-${tile.y.toFixed(4)}-${tile.s.toFixed(4)}`}
                tile={tile}
                photo={photo}
                dist={Math.abs(ox) + Math.abs(oy)}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function DiamondTile({
  tile,
  photo,
  dist,
}: {
  tile: Tile;
  photo: Photo;
  dist: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${tile.x * 100}%`,
        top: `${tile.y * 100}%`,
        width: `${tile.s * 100}%`,
        height: `${tile.s * 100}%`,
      }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.08 + dist * 0.5,
        type: "spring",
        stiffness: 220,
        damping: 22,
      }}
    >
      {/* inset creates the padding between neighbouring diamonds */}
      <motion.div
        whileHover={{ scale: 1.07, zIndex: 20 }}
        className="group absolute inset-[2.5px] overflow-hidden rounded-[12%] bg-washi-2 shadow-[0_8px_22px_-12px_rgba(25,32,47,0.55)] ring-1 ring-washi/50 sm:inset-[3.5px]"
        style={{ zIndex: 1 }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={photo.url}
            src={photo.url}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            // Counter-rotate upright; scale stays >=1.42 (≈√2) to cover the diamond.
            initial={{ opacity: 0, scale: 1.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1.42, rotate: -45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </motion.div>
    </motion.div>
  );
}
