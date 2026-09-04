"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSwipe } from "@/app/hooks/useSwipe";

type LightboxProps = {
  /** Full-size image URLs, in display order. */
  images: string[];
  /** Index of the open image, or null when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  alt?: (index: number) => string;
  caption?: (index: number) => string | undefined;
};

/**
 * Full-screen image viewer: click an image to open it at full size, arrows or
 * swipe to move through the set, Escape or a click outside the image to close.
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  alt,
  caption,
}: LightboxProps) {
  // Rendered through a portal on document.body. The project modal sets
  // backdrop-blur on its panel, and backdrop-filter makes that panel the
  // containing block for fixed-position descendants, which would otherwise
  // trap this viewer inside the modal and clip it.
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  const open = index !== null && index >= 0 && index < images.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      const next = index + delta;
      if (next >= 0 && next < images.length) onIndexChange(next);
    },
    [index, images.length, onIndexChange]
  );

  // Capture phase, and stop the event dead. The project modal and the image
  // tabs underneath listen for Escape and the arrow keys on window too, so
  // without this a single Escape would close the viewer and the modal at once.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.stopImmediatePropagation();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.stopImmediatePropagation();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose, go]);

  // Restore the previous overflow rather than clearing it. When the viewer is
  // opened from inside the project modal, that modal is holding a scroll lock
  // of its own and has to keep it once the viewer closes.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const swipe = useSwipe(
    () => go(1),
    () => go(-1)
  );

  if (!host || !open || index === null) return null;

  const text = caption?.(index);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      {...swipe}
    >
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-cream/60 text-xs tracking-[0.15em]">
          {images.length > 1 ? `${index + 1} / ${images.length}` : ""}
        </span>
        <button
          onClick={(e) => {
            stop(e);
            onClose();
          }}
          className="w-10 h-10 flex items-center justify-center text-cream/60 hover:text-cream text-3xl leading-none transition-colors"
          aria-label="Close image viewer"
        >
          &times;
        </button>
      </div>

      {/* Clicking the padding around the image closes; clicking the image does not. */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 pb-4 sm:px-14 sm:pb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={alt?.(index) ?? `Image ${index + 1} of ${images.length}`}
          className="max-h-full max-w-full object-contain select-none"
          onClick={stop}
        />

        {index > 0 && (
          <button
            onClick={(e) => {
              stop(e);
              go(-1);
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/50 hover:bg-black/80 text-cream text-2xl transition-colors"
            aria-label="Previous image"
          >
            &larr;
          </button>
        )}
        {index < images.length - 1 && (
          <button
            onClick={(e) => {
              stop(e);
              go(1);
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/50 hover:bg-black/80 text-cream text-2xl transition-colors"
            aria-label="Next image"
          >
            &rarr;
          </button>
        )}
      </div>

      {text && (
        <p className="shrink-0 px-6 pb-5 text-center text-cream/60 text-xs tracking-wide">
          {text}
        </p>
      )}
    </div>,
    host
  );
}
