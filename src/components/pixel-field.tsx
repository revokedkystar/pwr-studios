"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural dithered pixel art: smooth value noise quantised into a small
 * palette, with checkerboard dithering between neighbouring colours.
 *
 * - `palette` runs from the "empty" colour to the "full" colour.
 * - `mode` shapes the noise: a clearing in the middle (`clouds`), a fade
 *   toward the top or bottom edge, or plain noise (`flat`).
 * - `speed` > 0 makes the field drift slowly (off when reduced motion is on).
 *
 * Everything is seeded, so server and client agree and nothing depends on
 * Math.random() or the current time during render.
 */

export type PixelMode = "clouds" | "fade-down" | "fade-up" | "flat";

type Props = {
  palette: string[];
  cell?: number;
  dither?: number;
  seed?: number;
  scale?: number;
  mode?: PixelMode;
  speed?: number;
  /**
   * Name of a window CustomEvent whose `detail` (0 → 1) sets how far the
   * field has crumbled away: 0 is the full field, 1 is completely gone.
   */
  dissolveOn?: string;
  className?: string;
};

function hash(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);
  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

function fbm(x: number, y: number, seed: number) {
  let amp = 0.55;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < 3; o++) {
    sum += valueNoise(x * freq, y * freq, seed + o * 17) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum / norm;
}

function shape(mode: PixelMode, n: number, u: number, v: number) {
  switch (mode) {
    case "clouds": {
      const dx = (u - 0.5) / 0.46;
      const dy = (v - 0.46) / 0.4;
      const d = Math.sqrt(dx * dx + dy * dy);
      const edge = Math.max(0, d - 0.62) * 1.1;
      const floor = Math.max(0, v - 0.84) * 3.5;
      return n * 1.05 + edge - floor - 0.42;
    }
    case "fade-down":
      return n * 0.7 + (1 - v) * 1.15 - 0.45;
    case "fade-up":
      return n * 0.7 + v * 1.15 - 0.45;
    default:
      return n * 1.6 - 0.3;
  }
}

export function PixelField({
  palette,
  cell = 22,
  dither = 2,
  seed = 7,
  scale = 0.09,
  mode = "flat",
  speed = 0,
  dissolveOn,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = speed > 0 && !reduce;
    const patterns = new Map<string, CanvasPattern>();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let t = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    // Dissolve amount, 0 (full field) → 1 (gone), set from outside.
    let dissolve = 0;

    const checker = (a: string, b: string) => {
      const key = `${a}|${b}|${dpr}`;
      const hit = patterns.get(key);
      if (hit) return hit;
      const s = Math.max(1, Math.round(dither * dpr));
      const tile = document.createElement("canvas");
      tile.width = tile.height = s * 2;
      const tc = tile.getContext("2d")!;
      tc.fillStyle = a;
      tc.fillRect(0, 0, s * 2, s * 2);
      tc.fillStyle = b;
      tc.fillRect(s, 0, s, s);
      tc.fillRect(0, s, s, s);
      const p = ctx.createPattern(tile, "repeat")!;
      patterns.set(key, p);
      return p;
    };

    const draw = () => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (dissolve >= 1) return;
      // Stretch slightly past 1 so the last stragglers shrink before vanishing.
      const dp = dissolve > 0 ? dissolve * 1.12 : -1;
      const steps = palette.length * 2 - 1;
      const px = cell * dpr;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let size = 1;
          if (dp >= 0) {
            // Each pixel leaves at its own moment: mostly random, centre first.
            const dx = (x + 0.5) / cols - 0.5;
            const dy = (y + 0.5) / rows - 0.5;
            const d = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 0.71);
            const when = hash(x, y, seed + 101) * 0.75 + d * 0.25;
            if (when < dp) continue;
            // Shrink in the moment before it goes, so the sky crumbles.
            if (when < dp + 0.12) size = 0.35 + ((when - dp) / 0.12) * 0.65;
          }
          const n = fbm(x * scale + t, y * scale + t * 0.35, seed);
          const value = shape(mode, n, (x + 0.5) / cols, (y + 0.5) / rows);
          const idx = Math.min(steps - 1, Math.max(0, Math.floor(value * steps)));
          ctx.fillStyle =
            idx % 2 === 0
              ? palette[idx / 2]
              : checker(palette[(idx - 1) / 2], palette[(idx + 1) / 2]);
          if (size === 1) {
            ctx.fillRect(Math.round(x * px), Math.round(y * px), Math.ceil(px), Math.ceil(px));
          } else {
            const s = Math.max(1, Math.round(px * size));
            ctx.fillRect(Math.round(x * px + (px - s) / 2), Math.round(y * px + (px - s) / 2), s, s);
          }
        }
      }
    };

    const resize = () => {
      // Layout size (ignores CSS transforms, so a field that starts scaled
      // to 0 and pops in still gets its full size).
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      patterns.clear();
      draw();
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // Drift redraws ~7 times a second (nothing to draw once fully dissolved).
      if (!visible || dissolve >= 1 || now - last < 140) return;
      last = now;
      t += speed;
      draw();
    };

    const onDissolve = (e: Event) => {
      const next = Math.min(1, Math.max(0, Number((e as CustomEvent<number>).detail) || 0));
      if (next === dissolve) return;
      dissolve = next;
      draw();
    };
    if (dissolveOn) window.addEventListener(dissolveOn, onDissolve);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    resize();
    if (animate) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (dissolveOn) window.removeEventListener(dissolveOn, onDissolve);
    };
  }, [palette, cell, dither, seed, scale, mode, speed, dissolveOn]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
}
