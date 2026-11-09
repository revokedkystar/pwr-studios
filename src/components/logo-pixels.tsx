"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Logo = { name: string; src: string };

/** Share of the reel between one logo starting to assemble and the next. */
const STAGGER = 0.14;
/** Share of the reel one logo takes to assemble. */
const BUILD = 0.5;
/** Scroll share spent animating; the rest holds the finished row. */
const PLAY = 0.88;

type Particle = {
  sx: number; // start (scattered)
  sy: number;
  tx: number; // target (its spot in the logo)
  ty: number;
  bend: number; // sideways swing of its flight path, px
  delay: number; // 0 → 0.45 within the logo's build
  r: number;
  g: number;
  b: number;
  grey: number;
};

type Built = {
  particles: Particle[];
  cell: number;
  img: HTMLCanvasElement; // cropped logo, for the crisp final version
  dest: { x: number; y: number; w: number; h: number };
};

/** Small seeded PRNG so every visit scatters the pixels the same way. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Load an image and crop it to its visible (non-transparent) area. */
async function loadCropped(src: string): Promise<HTMLCanvasElement> {
  const img = new window.Image();
  img.src = src;
  await img.decode();
  const scale = 900 / Math.max(img.naturalWidth || 900, img.naturalHeight || 900);
  const w = Math.max(1, Math.round((img.naturalWidth || 900) * scale));
  const h = Math.max(1, Math.round((img.naturalHeight || 900) * scale));
  const full = document.createElement("canvas");
  full.width = w;
  full.height = h;
  const fc = full.getContext("2d", { willReadFrequently: true })!;
  fc.drawImage(img, 0, 0, w, h);
  const { data } = fc.getImageData(0, 0, w, h);
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 16) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < x0) return full;
  const out = document.createElement("canvas");
  out.width = x1 - x0 + 1;
  out.height = y1 - y0 + 1;
  out.getContext("2d")!.drawImage(full, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

/**
 * Sticky "Experience with" section where each company logo is assembled
 * from pixels as you scroll.
 *
 * The section is a few screens tall with a sticky panel, so it stays locked
 * on screen. Each logo starts as a swarm of coloured pixels (sampled from
 * the logo itself) scattered around and beyond the screen. Scrolling pulls
 * them in along curved paths into place, one company after another; each
 * pixel goes from grey to its real colour as it lands. Once a logo is
 * complete it crossfades into the crisp logo and the counter ticks up.
 *
 * Everything is drawn on one canvas over the row of logo slots. Without
 * JavaScript, or with reduced motion, the plain logos show in the row.
 */
export function LogoPixels({ logos }: { logos: Logo[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = root.firstElementChild as HTMLElement;
    const canvas = root.querySelector("canvas")!;
    const ctx = canvas.getContext("2d")!;
    const slots = Array.from(root.querySelectorAll<HTMLElement>("[data-slot]"));
    const counter = root.querySelector<HTMLElement>("[data-count]");
    let sources: HTMLCanvasElement[] = [];
    let built: Built[] = [];
    let dpr = 1;
    let raf = 0;
    let shown = -1;
    let alive = true;

    // Work out where each logo goes and turn it into particles.
    const layout = () => {
      const p = panel.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(p.width * dpr);
      canvas.height = Math.round(p.height * dpr);
      const reach = Math.max(p.width, p.height);
      built = sources.map((src, k) => {
        const s = slots[k].getBoundingClientRect();
        // Fit the cropped logo inside its slot.
        const fit = Math.min(s.width / src.width, s.height / src.height);
        const w = src.width * fit;
        const h = src.height * fit;
        const dest = { x: s.left - p.left + (s.width - w) / 2, y: s.top - p.top + (s.height - h) / 2, w, h };
        // About 70 pixels across the logo's width.
        const cell = Math.max(2.5, w / 70);
        const cols = Math.ceil(w / cell);
        const rows = Math.ceil(h / cell);
        const sample = document.createElement("canvas");
        sample.width = cols;
        sample.height = rows;
        const sc = sample.getContext("2d", { willReadFrequently: true })!;
        sc.drawImage(src, 0, 0, cols, rows);
        const { data } = sc.getImageData(0, 0, cols, rows);
        const rand = rng(1000 + k * 77);
        const particles: Particle[] = [];
        for (let y = 0; y < rows; y++)
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            if (data[i + 3] < 110) continue;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const tx = dest.x + x * cell;
            const ty = dest.y + y * cell;
            // Scatter: some across the screen, most from beyond its edges.
            const angle = rand() * Math.PI * 2;
            const dist = rand() < 0.35 ? rand() * reach * 0.5 : reach * (0.55 + rand() * 0.6);
            particles.push({
              sx: tx + Math.cos(angle) * dist,
              sy: ty + Math.sin(angle) * dist,
              tx,
              ty,
              bend: (rand() - 0.5) * 2 * (80 + rand() * 220),
              delay: rand() * 0.45,
              r,
              g,
              b,
              grey: Math.round(0.3 * r + 0.59 * g + 0.11 * b),
            });
          }
        return { particles, cell, img: src, dest };
      });
    };

    const draw = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? clamp01(-rect.top / travel) : 1;
      const reel = Math.min(1, progress / PLAY) * ((built.length - 1) * STAGGER + BUILD);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let done = 0;
      built.forEach((logo, k) => {
        const lp = clamp01((reel - k * STAGGER) / BUILD);
        if (lp >= 0.999) done++;
        // Crossfade from pixels to the crisp logo at the very end.
        const crisp = clamp01((lp - 0.9) / 0.1);
        if (lp <= 0) return;
        if (crisp < 1) {
          for (const pt of logo.particles) {
            const e0 = clamp01((lp - pt.delay) / 0.55);
            if (e0 <= 0) continue;
            const e = 1 - Math.pow(1 - e0, 3);
            // Curved flight: swing sideways mid-way, settle at the target.
            const swing = Math.sin(Math.PI * e) * pt.bend;
            const dx = pt.tx - pt.sx;
            const dy = pt.ty - pt.sy;
            const len = Math.hypot(dx, dy) || 1;
            const x = pt.sx + dx * e + (-dy / len) * swing;
            const y = pt.sy + dy * e + (dx / len) * swing;
            // Grey while flying, its real colour as it lands.
            const c = e * e;
            const r = Math.round(pt.grey + (pt.r - pt.grey) * c);
            const g = Math.round(pt.grey + (pt.g - pt.grey) * c);
            const b = Math.round(pt.grey + (pt.b - pt.grey) * c);
            ctx.globalAlpha = Math.min(1, e0 * 2) * (1 - crisp);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            const size = logo.cell * (1.8 - 0.8 * e);
            ctx.fillRect(x - (size - logo.cell) / 2, y - (size - logo.cell) / 2, size + 0.5, size + 0.5);
          }
        }
        if (crisp > 0) {
          ctx.globalAlpha = crisp;
          ctx.drawImage(logo.img, logo.dest.x, logo.dest.y, logo.dest.w, logo.dest.h);
        }
      });
      ctx.globalAlpha = 1;
      if (done !== shown && counter) {
        shown = done;
        counter.textContent = String(done).padStart(2, "0");
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const relayout = () => {
      if (!sources.length) return;
      layout();
      schedule();
    };

    Promise.all(logos.map((l) => loadCropped(l.src)))
      .then((list) => {
        if (!alive) return;
        sources = list;
        layout();
        root.dataset.ready = "true"; // hides the plain logos; the canvas takes over
        draw();
      })
      .catch(() => {
        /* Leave the plain logos showing if anything fails to load. */
      });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", relayout);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", relayout);
    };
  }, [logos]);

  const total = logos.length;

  return (
    <div ref={ref} className="pix group/pix relative h-[320svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-14 overflow-hidden sm:gap-20">
        <header className="wrap flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h3 id="experience" className="section-title">
            Experience
            <br />
            with
          </h3>
          <p className="text-sm text-black/50 tabular-nums">
            <span data-count className="text-black">
              {String(total).padStart(2, "0")}
            </span>{" "}
            / {String(total).padStart(2, "0")} companies
          </p>
        </header>

        <ul aria-labelledby="experience" className="wrap grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5 lg:gap-x-10">
          {logos.map((l, i) => (
            <li key={l.name} className={i === total - 1 && total % 2 === 1 ? "max-lg:col-span-2" : ""}>
              {/* The slot the canvas draws into; the plain logo is the no-JS fallback. */}
              <div data-slot className="relative mx-auto h-12 w-full max-w-[220px] sm:h-16">
                <Image
                  src={l.src}
                  alt={l.name}
                  fill
                  sizes="220px"
                  className="object-contain transition-opacity group-data-[ready=true]/pix:opacity-0"
                />
              </div>
            </li>
          ))}
        </ul>

        <canvas aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      </div>
    </div>
  );
}
