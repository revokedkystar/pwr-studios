"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Company = {
  name: string;
  src: string;
  role?: string;
  note?: string;
};

/*
 * "Experience with": company cards on a tilted ring that spins on its own,
 * all the time (not tied to scroll). The heading and the featured company's
 * note sit in the middle; cards at the back of the ring are smaller, faded
 * and blurred and pass behind the text, cards at the front pass below it.
 * Whichever company's card is at the front is the one described in the
 * middle. Hovering a card slows the ring. With reduced motion the ring holds
 * still. With only a few companies, each appears twice (on opposite sides)
 * so the ring doesn't look sparse.
 */

const TURN_SECONDS = 60; // one full turn
// Card sizes (width, height) before scaling, so the ring isn't uniform.
const SIZES: [number, number][] = [
  [230, 170],
  [180, 220],
  [210, 210],
  [250, 180],
  [190, 240],
];

export function ExperienceRing({ companies, titleId = "experience" }: { companies: Company[]; titleId?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [front, setFront] = useState(0);

  // A short list is shown twice, the second set half a turn round.
  const repeat = companies.length < 8 ? 2 : 1;
  const cards = Array.from({ length: repeat }, () => companies).flat().map((c, i) => ({
    company: c,
    index: i % companies.length,
    size: SIZES[i % SIZES.length],
  }));
  const n = cards.length;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const els = cardRefs.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let angle = 0;
    let speed = 1; // eases towards 1, or 0.25 while a card is hovered
    let slow = false;
    let last = 0;
    let raf = 0;
    let visible = true;
    let shownFront = -1;

    const place = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const narrow = w < 640;
      // Wide screens: the ring sits a little below the text, so its front
      // passes under the note and its back passes behind the heading.
      // Phones: no room beside the text, so the ring sits in the lower part
      // of the screen, under the text.
      const cx = w / 2;
      const cy = h * (narrow ? 0.7 : 0.52);
      const rx = Math.min(w * (narrow ? 0.36 : 0.4), 640);
      const ry = h * (narrow ? 0.15 : 0.34);
      const unit = narrow ? Math.min(0.62, w / 630) : Math.min(1, w / 1280, h / 820);
      let best = -Infinity;
      let bestIndex = 0;
      els.forEach((el, i) => {
        if (!el) return;
        const a = angle + (i / n) * Math.PI * 2;
        const depth = (Math.cos(a) + 1) / 2; // 1 at the front, 0 at the back
        const x = cx + Math.sin(a) * rx;
        const y = cy + Math.cos(a) * ry;
        const scale = (0.5 + 0.5 * depth) * unit;
        const [cw, ch] = cards[i].size;
        el.style.width = `${cw}px`;
        el.style.height = `${ch}px`;
        el.style.transform = `translate3d(${(x - cw / 2).toFixed(1)}px, ${(y - ch / 2).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.opacity = String((0.35 + 0.65 * depth).toFixed(3));
        const blur = Math.max(0, 0.55 - depth) * 12;
        el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
        if (depth > best) {
          best = depth;
          bestIndex = cards[i].index;
        }
      });
      if (bestIndex !== shownFront) {
        shownFront = bestIndex;
        setFront(bestIndex);
      }
    };

    const tick = (now: number) => {
      raf = visible ? requestAnimationFrame(tick) : 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0);
      last = now;
      speed += ((slow ? 0.25 : 1) - speed) * Math.min(1, dt * 4);
      angle -= ((Math.PI * 2) / TURN_SECONDS) * speed * dt;
      place();
    };

    const onOver = (e: Event) => {
      slow = !!(e.target as HTMLElement).closest("[data-ring-card]");
    };
    const onLeave = () => {
      slow = false;
    };

    place();
    if (reduce) {
      const ro = new ResizeObserver(place);
      ro.observe(stage);
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(stage);
    stage.addEventListener("pointerover", onOver);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerover", onOver);
      stage.removeEventListener("pointerleave", onLeave);
    };
    // The cards are fixed for a given list of companies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies]);

  const total = String(companies.length).padStart(2, "0");
  const current = companies[front];

  return (
    <div ref={stageRef} className="relative h-svh max-h-[920px] min-h-[640px] overflow-hidden bg-white">
      {/* The ring. Cards are placed by the effect above. */}
      <div aria-hidden className="absolute inset-0">
        {cards.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-ring-card
            className="absolute top-0 left-0 flex origin-center flex-col justify-between rounded-[28px] border border-black/[0.06] bg-surface p-4 opacity-0 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] will-change-transform"
          >
            <span className="self-start rounded-md bg-white px-1.5 py-0.5 text-[12px] text-black/70">
              {String(c.index + 1).padStart(2, "0")}
            </span>
            <div className="relative mx-auto h-[38%] w-[72%]">
              <Image src={c.company.src} alt="" fill sizes="200px" className="object-contain" />
            </div>
            <span className="text-[13px] leading-tight text-black/60">{c.company.role}</span>
          </div>
        ))}
      </div>

      {/* Heading and the front company's note, in the middle of the ring. */}
      <div className="pointer-events-none absolute inset-0 z-[50] flex flex-col items-center justify-start px-6 pt-[12svh] text-center sm:justify-center sm:pt-0 sm:pb-[10svh]">
        <h3 id={titleId} className="section-title">
          Experience
          <br />
          with
        </h3>
        <div key={front} className="ring-note mt-6 max-w-[440px]">
          <p className="text-[13px] text-black/45 tabular-nums">
            {String(front + 1).padStart(2, "0")} / {total} · {current?.name}
          </p>
          {current?.role && <p className="mt-1 text-2xl font-medium tracking-[-0.01em]">{current.role}</p>}
          {current?.note && <p className="mt-2 text-[16px] leading-[1.4] text-black/60">{current.note}</p>}
        </div>
      </div>

      {/* For screen readers: the full list, without the motion. */}
      <ul className="sr-only">
        {companies.map((c) => (
          <li key={c.name}>
            {c.name}
            {c.role ? `: ${c.role}` : ""}
            {c.note ? `. ${c.note}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
