"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Photo } from "@/lib/blob";

const SWAP_INTERVAL_MS = 2600;
const SPEED = 60; // px / second the carousel drifts left
const ROOT2 = Math.SQRT2;

interface Dims {
  bandH: number;
  P: number; // diamond point-to-point size
  unit: number; // lattice spacing = P / 2
  cols: number; // even — columns in one (looping) segment
  jLo: number;
  jHi: number;
}

interface Tile {
  i: number;
  j: number;
  size: 1 | 2;
}

const isEven = (i: number, j: number) => ((((i + j) % 2) + 2) % 2) === 0;

function computeDims(vw: number): Dims {
  let bandH: number;
  let P: number;
  if (vw < 480) {
    bandH = 196;
    P = 158;
  } else if (vw < 1024) {
    bandH = 300;
    P = 212;
  } else {
    bandH = 360;
    P = 250;
  }
  const unit = P / 2;
  const cols = Math.max(8, Math.ceil((vw * 1.5) / unit / 2) * 2); // keep even
  const jLo = -1;
  const jHi = Math.ceil((2 * bandH) / P);
  return { bandH, P, unit, cols, jLo, jHi };
}

/**
 * Build one horizontally-tileable segment of a diamond tessellation. Unit
 * diamonds sit on every even lattice cell (full coverage); some 2×2 blocks are
 * promoted to a single large diamond (centered on an odd vertex) for variety.
 * 2× tiles never touch the segment's first/last column, so a second identical
 * copy placed one segment-width to the right tessellates seamlessly at the seam.
 */
function buildTiles(cols: number, jLo: number, jHi: number): Tile[] {
  const occ = new Set<string>();
  const key = (i: number, j: number) => `${i},${j}`;
  const inRange = (i: number, j: number) =>
    i >= 0 && i < cols && j >= jLo && j <= jHi;
  const tiles: Tile[] = [];

  // Large (2×) diamonds on odd vertices, away from the seam columns.
  for (let j = jLo; j <= jHi; j += 1) {
    for (let i = 2; i < cols - 2; i += 1) {
      if (isEven(i, j)) continue; // need an odd vertex
      if (Math.random() > 0.28) continue;
      const cells: [number, number][] = [
        [i + 1, j],
        [i - 1, j],
        [i, j + 1],
        [i, j - 1],
      ];
      if (cells.every(([ci, cj]) => inRange(ci, cj) && !occ.has(key(ci, cj)))) {
        cells.forEach(([ci, cj]) => occ.add(key(ci, cj)));
        tiles.push({ i, j, size: 2 });
      }
    }
  }

  // Fill every remaining even cell with a unit diamond.
  for (let j = jLo; j <= jHi; j += 1) {
    for (let i = 0; i < cols; i += 1) {
      if (!isEven(i, j) || occ.has(key(i, j))) continue;
      tiles.push({ i, j, size: 1 });
    }
  }
  return tiles;
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
  const [vw, setVw] = useState(1280);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const dims = useMemo(() => computeDims(vw), [vw]);
  const tiles = useMemo(
    () => buildTiles(dims.cols, dims.jLo, dims.jHi),
    [dims.cols, dims.jLo, dims.jHi]
  );
  const segmentW = dims.cols * dims.unit;
  const side1 = dims.P / ROOT2;

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

  // One photo per tile; if there are more tiles than photos, cycle through a
  // shuffled order (so neighbours differ). Both track copies read this array,
  // keeping the two halves identical for a seamless loop.
  useEffect(() => {
    if (pool.length === 0 || tiles.length === 0) {
      setAssign([]);
      return;
    }
    const shuffled = shuffle(pool);
    setAssign(tiles.map((_, k) => shuffled[k % shuffled.length]));
  }, [pool, tiles]);

  // Occasionally swap a tile to a different photo for freshness.
  const poolRef = useRef(pool);
  poolRef.current = pool;
  useEffect(() => {
    const id = setInterval(() => {
      setAssign((cur) => {
        if (cur.length === 0 || poolRef.current.length <= 1) return cur;
        const k = Math.floor(Math.random() * cur.length);
        const others = poolRef.current.filter((p) => p.url !== cur[k]?.url);
        if (others.length === 0) return cur;
        const next = [...cur];
        next[k] = others[Math.floor(Math.random() * others.length)];
        return next;
      });
    }, SWAP_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (assign.length === 0) return null;

  return (
    <section className="relative overflow-hidden pb-24 pt-2 sm:pb-28">
      {/* warm glow behind the carousel */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vw] max-h-[24rem] w-[96vw] max-w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(192,57,43,0.18), rgba(176,133,52,0.12) 45%, transparent 70%)",
        }}
      />

      <motion.div
        aria-hidden
        className="relative w-full overflow-hidden"
        style={{
          height: dims.bandH,
          maskImage:
            "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="collage-track absolute left-0 top-0 h-full"
          style={{
            width: segmentW * 2,
            animation: `collage-marquee ${(segmentW / SPEED).toFixed(2)}s linear infinite`,
          }}
        >
          {[0, 1].map((copy) =>
            tiles.map((t, k) => {
              const photo = assign[k];
              if (!photo) return null;
              const side = t.size === 2 ? side1 * 2 : side1;
              const cx = t.i * dims.unit + copy * segmentW;
              const cy = t.j * dims.unit;
              return (
                <div
                  key={`${copy}-${k}`}
                  className="absolute"
                  style={{
                    left: cx - side / 2,
                    top: cy - side / 2,
                    width: side,
                    height: side,
                    transform: "rotate(45deg)",
                  }}
                >
                  <div className="group absolute inset-[3px] overflow-hidden bg-washi-2 shadow-[0_8px_22px_-12px_rgba(25,32,47,0.55)] ring-1 ring-washi/40">
                    <AnimatePresence initial={false}>
                      <motion.img
                        key={photo.url}
                        src={photo.url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        // Counter-rotate upright; scale >=1.42 (≈√2) covers the diamond.
                        initial={{ opacity: 0, scale: 1.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1.42, rotate: -45 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </section>
  );
}
