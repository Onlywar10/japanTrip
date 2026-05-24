"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { Photo } from "@/lib/blob";
import { cn } from "@/lib/utils";

interface Props {
  photo: Photo;
  index: number;
  selectMode: boolean;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
}

export function PhotoTile({
  photo,
  index,
  selectMode,
  selected,
  onToggle,
  onOpen,
}: Props) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.03, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={selectMode ? onToggle : onOpen}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-2xl bg-washi-2 border border-line",
        "transition-[transform,box-shadow,border-color] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion/40",
        selected ? "ring-2 ring-vermillion" : "hover:border-ink-faint",
      )}
    >
      {}
      <img
        src={photo.url}
        alt={photo.filename}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-300",
          "group-hover:scale-[1.04]",
          selected && "scale-[0.96]"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity",
          selected
            ? "bg-ink/30 opacity-100"
            : "bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100"
        )}
      />
      {selectMode ? (
        <span
          aria-hidden
          className={cn(
            "absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full border-2 transition-colors",
            selected
              ? "bg-vermillion border-vermillion text-white"
              : "bg-white/85 border-white/85 text-transparent"
          )}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      ) : null}
    </motion.button>
  );
}
