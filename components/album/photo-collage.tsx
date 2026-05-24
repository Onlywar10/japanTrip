"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Photo } from "@/lib/blob";

export function PhotoCollage() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/photos", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { photos?: Photo[] };
        if (!cancelled) setPhotos((data.photos ?? []).slice(0, 24));
      } catch {
        // collage is decorative — silently no-op
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (photos.length === 0) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <div className="grid h-full w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 grid-rows-3 sm:grid-rows-4 gap-1.5 p-2 opacity-25 mix-blend-screen">
        {photos.map((p, i) => (
          <motion.div
            key={p.url}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.1,
              delay: Math.min(i * 0.04, 0.6),
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative overflow-hidden rounded-lg"
          >
            {}
            <img
              src={p.url}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/55 to-ink/85" />
      <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-ink/60 to-transparent" />
    </div>
  );
}
