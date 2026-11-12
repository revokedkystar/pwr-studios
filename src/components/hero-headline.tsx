"use client";

import { useEffect, useRef } from "react";
import { HERO_DISSOLVE } from "./hero-events";
import { PixelField } from "./pixel-field";

const INK = ["#ffffff", "#8f8f8f", "#0a0a0a"];

/*
 * Intro timeline, in "ms" of a virtual clock that scroll position drives.
 * The sky crumbles over the first stretch, the first line collapses into
 * its tile, the lines swap, and the second line bursts out of the tile.
 */
const SKY_END = 520;
const SWAP_AT = 700;
const END = 1350;
/** Share of the hero's pinned scroll spent animating; the rest holds the result. */
const PLAY_SHARE = 0.8;

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
 * Hero headline with a scroll-driven intro. The hero is pinned (sticky) while
 * you scroll through it, and scroll progress scrubs the sequence:
 *
 * 1. the pixel sky behind the hero crumbles away (PixelField dissolveOn)
 * 2. "Computing ▣ meets creativity" collapses into its pixel tile, which grows
 * 3. "Developer ▣ & designer" bursts out of the tile, word by word, while
 *    the tile glides back into its place in the new line
 *
 * Scrolling back up plays it in reverse. The animations are Web Animations
 * kept paused, with their currentTime set from scroll. With reduced motion
 * the first line simply stays over the pixel sky.
 */
export function HeroHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h1 = ref.current;
    const hero = h1?.closest<HTMLElement>("[data-hero]");
    if (!h1 || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = h1.querySelector<HTMLElement>('[data-phase="a"]')!;
    const b = h1.querySelector<HTMLElement>('[data-phase="b"]')!;
    let anims: Animation[] = [];
    let raf = 0;
    let lastSky = -1;
    let alive = true;

    // Build the (paused) animations from the current layout.
    const build = () => {
      anims.forEach((x) => x.cancel());
      anims = [];
      const add = (el: Element, frames: Keyframe[], opts: KeyframeAnimationOptions) => {
        const anim = el.animate(frames, { fill: "both", ...opts });
        anim.pause();
        anims.push(anim);
      };

      const tileA = a.querySelector("[data-tile]")!;
      const tileB = b.querySelector("[data-tile]")!;
      const t = centre(tileA);
      const tb = centre(tileB);

      a.querySelectorAll("[data-word]").forEach((w, i) => {
        const c = centre(w);
        add(
          w,
          [
            { transform: "none", opacity: 1, filter: "blur(0px)" },
            { transform: `translate(${t.x - c.x}px, ${t.y - c.y}px) scale(0.12)`, opacity: 0, filter: "blur(6px)" },
          ],
          { duration: 440, delay: 120 + i * 45, easing: "cubic-bezier(0.6, 0, 0.8, 0.4)" },
        );
      });
      add(tileA, [{ transform: "scale(1)" }, { transform: "scale(1.9)" }], {
        duration: 460,
        delay: 200,
        easing: "cubic-bezier(0.3, 0, 0.2, 1)",
      });

      add(
        tileB,
        [{ transform: `translate(${t.x - tb.x}px, ${t.y - tb.y}px) scale(1.9)` }, { transform: "none" }],
        { duration: 520, delay: SWAP_AT, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
      b.querySelectorAll("[data-word]").forEach((w, i) => {
        const c = centre(w);
        add(
          w,
          [
            { transform: `translate(${t.x - c.x}px, ${t.y - c.y}px) scale(0.12)`, opacity: 0, filter: "blur(6px)" },
            { transform: "none", opacity: 1, filter: "blur(0px)" },
          ],
          { duration: 480, delay: SWAP_AT + 40 + i * 70, easing: "cubic-bezier(0.2, 1.15, 0.3, 1)" },
        );
      });
    };

    const update = () => {
      raf = 0;
      const rect = hero.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      const time = Math.min(END, (progress / PLAY_SHARE) * END);
      anims.forEach((x) => (x.currentTime = time));
      const swapped = time >= SWAP_AT;
      a.style.visibility = swapped ? "hidden" : "visible";
      b.style.visibility = swapped ? "visible" : "hidden";
      const sky = Math.min(1, time / SKY_END);
      if (sky !== lastSky) {
        lastSky = sky;
        window.dispatchEvent(new CustomEvent(HERO_DISSOLVE, { detail: sky }));
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const rebuild = () => {
      build();
      update();
    };

    rebuild();
    // The pixel sky mounts alongside this; make sure it gets the starting state.
    const settle = requestAnimationFrame(() => {
      lastSky = -1;
      update();
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", rebuild);
    // Words shift slightly once the display font loads, so measure again then.
    document.fonts?.ready.then(() => alive && rebuild());
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", rebuild);
      anims.forEach((x) => x.cancel());
    };
  }, []);

  return (
    <h1 ref={ref} className="display grid text-center">
      <span className="sr-only">xanti studios: web designer and developer in Devon, UK. Computing meets creativity.</span>
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
