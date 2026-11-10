"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon, Tag } from "@/components/ui";

export type Sighting = {
  title: string;
  tag: string;
  caption: string;
  image: string;
  alt: string;
};

/*
 * "Seen in the industry": photos in an editorial grid, each with a label,
 * a title and a short caption. The photos come into colour as they scroll
 * into view. Clicking one opens it full screen in a native <dialog>, where
 * the arrow buttons or keys step through the set and Esc closes it.
 */

// Grid placement on wide screens: a big and a small photo per row,
// swapping sides on the second row.
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function IndustryGallery({ items }: { items: Sighting[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback((i: number) => {
    setOpen(i);
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (by: number) => setOpen((i) => (i === null ? i : (i + by + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setOpen(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    d.addEventListener("close", onClose);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = open === null ? null : items[open];
  const total = String(items.length).padStart(2, "0");

  return (
    <>
      <ul className="wrap mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-12">
        {items.map((it, i) => (
          <li key={it.image} data-scroll data-lag={(i % 2) * 0.12} className={`fx-rise ${SPANS[i % SPANS.length]}`}>
            <button
              type="button"
              onClick={() => show(i)}
              aria-label={`Open photo: ${it.title}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-surface text-left sm:aspect-square lg:aspect-auto lg:h-[460px]"
            >
              <Image
                src={it.image}
                alt={it.alt}
                fill
                sizes="(min-width: 1024px) 58vw, (min-width: 640px) 50vw, 92vw"
                className="fx-colour object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Shade at the top and bottom so the text reads on any photo. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 text-white">
                <Tag dark>{it.tag}</Tag>
                <span className="text-sm tabular-nums text-white/70">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 text-white sm:p-6">
                <div>
                  <h3 className="text-2xl leading-tight font-medium tracking-[-0.01em] sm:text-[28px]">{it.title}</h3>
                  <p className="mt-2 max-w-[42ch] text-[15px] leading-snug text-white/75">{it.caption}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
                  <ArrowIcon className="size-4" />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current ? current.title : "Photo"}
        onClick={(e) => {
          // A click on the dark backdrop (the dialog itself) closes it.
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto h-svh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/95 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-5 p-4 sm:p-10">
            <div className="pointer-events-auto relative h-[min(72svh,900px)] w-full max-w-[1100px]">
              <Image src={current.image} alt={current.alt} fill sizes="90vw" className="object-contain" />
            </div>
            <div className="pointer-events-auto flex w-full max-w-[1100px] flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-white/55">
                  {current.tag} · {String((open ?? 0) + 1).padStart(2, "0")} / {total}
                </p>
                <p className="mt-1 text-2xl font-medium tracking-[-0.01em]">{current.title}</p>
                <p className="mt-1 max-w-[60ch] text-[15px] text-white/70">{current.caption}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <ArrowIcon className="size-4 -rotate-[135deg]" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <ArrowIcon className="size-4 rotate-45" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="h-11 rounded-full bg-white px-5 text-sm font-medium text-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
