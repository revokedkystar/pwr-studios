"use client";

import { useEffect, useRef } from "react";
import { HERO_DISSOLVE } from "./hero-events";
import { PixelField } from "./pixel-field";

const INK = ["#ffffff", "#8f8f8f", "#0a0a0a"];


/** How far (px) the visitor must scroll before the intro plays. */
const TRIGGER_PX = 4;

function Tile() {
  return (
    <span data-tile className="relative mx-[0.12em] inline-block size-[0.72em] translate-y-[0.06em] overflow-hidden align-baseline">
      <PixelField palette={INK} cell={10} seed={3} scale={0.25} speed={0.02} className="absolute inset-0 size-full" />
    </span>
  );
}

function Word({ children }: { children: React.ReactNode }) {
  return (
    <span data-word className="inline-block">
      {children}
    </span>
  );
}

const centre = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

/**
 * Hero headline with a one-time intro, played the first time the visitor
 * scrolls (or straight away if the page loads already scrolled):
 *
 * 1. the pixel sky behind the hero crumbles away (see PixelField dissolveOn)
 * 2. "Computing ▣ meets creativity" collapses into its pixel tile, which grows
 * 3. "Developer ▣ & designer" bursts out of the tile, word by word, while the
 *    tile glides back down into its place in the new line
 *
 * With reduced motion the first line simply stays, over the pixel sky.
 */
export function HeroHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = h1.querySelector<HTMLElement>('[data-phase="a"]')!;
    const b = h1.querySelector<HTMLElement>('[data-phase="b"]')!;
    let cancelled = false;

    const run = async () => {
      window.dispatchEvent(new Event(HERO_DISSOLVE));

      // 1. Suck the first line into its tile.
      const tileA = a.querySelector("[data-tile]")!;
      const t = centre(tileA);
      a.querySelectorAll("[data-word]").forEach((w, i) => {
        const c = centre(w);
        w.animate(
          [
            { transform: "none", opacity: 1, filter: "blur(0px)" },
            { transform: `translate(${t.x - c.x}px, ${t.y - c.y}px) scale(0.12)`, opacity: 0, filter: "blur(6px)" },
          ],
          { duration: 520, delay: i * 45, easing: "cubic-bezier(0.6, 0, 0.8, 0.4)", fill: "forwards" },
        );
      });
      const grow = tileA.animate([{ transform: "scale(1)" }, { transform: "scale(1.9)" }], {
        duration: 560,
        delay: 120,
        easing: "cubic-bezier(0.3, 0, 0.2, 1)",
        fill: "forwards",
      });
      await grow.finished;
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 140));
      if (cancelled) return;

      // 2. Swap lines, and burst the second one out of the same spot.
      b.style.visibility = "visible";
      a.style.visibility = "hidden";
      const tileB = b.querySelector("[data-tile]")!;
      const tb = centre(tileB);
      tileB.animate(
        [{ transform: `translate(${t.x - tb.x}px, ${t.y - tb.y}px) scale(1.9)` }, { transform: "none" }],
        { duration: 760, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "backwards" },
      );
      b.querySelectorAll("[data-word]").forEach((w, i) => {
        const c = centre(w);
        w.animate(
          [
            { transform: `translate(${t.x - c.x}px, ${t.y - c.y}px) scale(0.12)`, opacity: 0, filter: "blur(6px)" },
            { transform: "none", opacity: 1, filter: "blur(0px)" },
          ],
          { duration: 780, delay: 90 + i * 80, easing: "cubic-bezier(0.2, 1.15, 0.3, 1)", fill: "backwards" },
        );
      });
    };

    let started = false;
    const onScroll = () => {
      if (started || window.scrollY < TRIGGER_PX) return;
      started = true;
      window.removeEventListener("scroll", onScroll);
      run();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <h1 ref={ref} className="display grid text-center">
      <span className="sr-only">Joshua Hatfield: computing meets creativity. Developer and designer.</span>
      <span data-phase="a" aria-hidden className="[grid-area:1/1]">
        <Word>Computing</Word> <Tile /> <Word>meets</Word>
        <br />
        <Word>creativity</Word>
      </span>
      <span data-phase="b" aria-hidden className="invisible [grid-area:1/1]">
        <Word>Developer</Word> <Tile /> <Word>&amp;</Word>
        <br />
        <Word>designer</Word>
      </span>
    </h1>
  );
}
