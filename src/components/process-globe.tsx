"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PixelField } from "@/components/pixel-field";

type Step = { label: string; color: string; x: string; y: string };

/*
 * The "Strategy / Design / Build" wheel, pinned while it scrolls past.
 *
 * Scrolling through the tall outer box keeps the wheel locked in the middle
 * of the screen and plays this through:
 *
 *   0.00 – 0.08  the wheel, as before
 *   0.08 – 0.40  the wheel melts into a 3D pixel globe that grows outwards
 *   0.40 – 0.60  the full-size globe spins with the scroll
 *   0.60 – 0.92  it shrinks back down and turns back into the wheel
 *
 * The globe is drawn as real pixels: each cell of a coarse grid is tested
 * against a sphere, shaded by a light and textured with seeded 3D noise, then
 * scaled up without smoothing. With reduced motion on, nothing is pinned and
 * the plain wheel is shown.
 */

const GLOBE = ["#1c1c1c", "#333333", "#5c5c5c", "#8f8f8f", "#c4c4c4", "#ffffff"];
const RGB = GLOBE.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
const SEED = 17;
const TILT = 0.42;
const LIGHT = (() => {
  const v = [-0.55, -0.6, 0.6];
  const l = Math.hypot(v[0], v[1], v[2]);
  return v.map((n) => n / l);
})();

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smoothstep = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function hash3(x: number, y: number, z: number) {
  let h = (x * 374761393 + y * 668265263 + z * 1440662683 + SEED * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function noise3(x: number, y: number, z: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const w = fz * fz * (3 - 2 * fz);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(ix + dx, iy + dy, iz + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}

/** "Continents": a few octaves of noise sampled on the sphere's surface. */
function terrain(x: number, y: number, z: number) {
  return (
    noise3(x * 1.6 + 7, y * 1.6, z * 1.6) * 0.6 +
    noise3(x * 3.4, y * 3.4 + 3, z * 3.4) * 0.28 +
    noise3(x * 7, y * 7, z * 7 + 11) * 0.12
  );
}

export function ProcessGlobe({ steps }: { steps: Step[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const wheel = wheelRef.current;
    const disc = discRef.current;
    const logo = logoRef.current;
    const labels = labelsRef.current;
    const canvas = canvasRef.current;
    if (!outer || !wheel || !disc || !logo || !labels || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    let image: ImageData | null = null;

    let raf = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGlobe = (cx: number, cy: number, radius: number, spin: number, alpha: number) => {
      // About 110 pixels across, whatever the globe's size on screen.
      const cell = Math.max(4, radius / 55);
      const n = Math.ceil((2 * radius) / cell);
      if (off.width !== n) {
        off.width = n;
        off.height = n;
        image = offCtx.createImageData(n, n);
      }
      if (!image) return;
      const data = image.data;
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);
      const cosL = Math.cos(spin);
      const sinL = Math.sin(spin);
      const scale = (n * cell) / (2 * radius);

      for (let j = 0; j < n; j++) {
        const py = ((j + 0.5) / n) * 2 * scale - scale;
        for (let i = 0; i < n; i++) {
          const k = (j * n + i) * 4;
          const px = ((i + 0.5) / n) * 2 * scale - scale;
          const d = px * px + py * py;
          if (d > 1) {
            data[k + 3] = 0;
            continue;
          }
          const pz = Math.sqrt(1 - d);
          // Tip the globe towards the viewer, then spin it about its axis.
          const y1 = py * cosT - pz * sinT;
          const z1 = py * sinT + pz * cosT;
          const x2 = px * cosL + z1 * sinL;
          const z2 = -px * sinL + z1 * cosL;
          const land = terrain(x2, y1, z2) > 0.47;
          const lit = clamp(px * LIGHT[0] + py * LIGHT[1] + pz * LIGHT[2]);
          const level = land ? 1.9 + 3.4 * lit : 0.1 + 1.3 * lit;
          // Checkerboard dithering between neighbouring greys.
          const idx = Math.min(GLOBE.length - 1, Math.max(0, Math.floor(level + ((i + j) & 1) * 0.5)));
          const c = RGB[idx];
          data[k] = c[0];
          data[k + 1] = c[1];
          data[k + 2] = c[2];
          data[k + 3] = 255;
        }
      }
      offCtx.putImageData(image, 0, 0);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = false;
      const size = n * cell;
      ctx.drawImage(off, cx - size / 2, cy - size / 2, size, size);
      ctx.restore();
    };

    const frame = (now: number) => {
      raf = visible ? requestAnimationFrame(frame) : 0;
      const vh = window.innerHeight;
      const box = outer.getBoundingClientRect();
      const t = clamp(-box.top / Math.max(1, box.height - vh));
      const morph = Math.min(smoothstep(0.08, 0.4, t), 1 - smoothstep(0.6, 0.92, t));

      disc.style.opacity = String(1 - smoothstep(0.05, 0.35, morph));
      disc.style.rotate = `${t * 140}deg`;
      logo.style.opacity = String(1 - smoothstep(0, 0.3, morph));
      logo.style.rotate = `${-t * 360}deg`;
      labels.style.opacity = String(1 - smoothstep(0, 0.25, morph));
      labels.style.scale = String(1 + morph * 0.25);

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const alpha = smoothstep(0.02, 0.3, morph);
      if (alpha <= 0) return;

      const c = canvas.getBoundingClientRect();
      const r = wheel.getBoundingClientRect();
      const r0 = r.width / 2;
      const rMax = Math.min(Math.max(r0 * 1.55, Math.min(w, h) * 0.46), Math.max(w, h) * 0.6);
      const radius = r0 + (rMax - r0) * morph;
      const spin = t * Math.PI * 3 + now * 0.00012;
      drawGlobe(r.left + r0 - c.left, r.top + r.height / 2 - c.top, radius, spin, alpha);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });

    resize();
    io.observe(outer);
    window.addEventListener("resize", resize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={outerRef} className="relative h-[260svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto">
        <div ref={wheelRef} className="relative aspect-square w-[min(520px,82vw,72svh)]">
          <div ref={discRef} className="absolute inset-0 overflow-hidden rounded-full">
            <PixelField
              palette={["#0a0a0a", "#4a4a4a", "#d4d4d4"]}
              cell={14}
              scale={0.13}
              seed={5}
              speed={0.01}
              className="size-full"
            />
          </div>
          <div ref={logoRef} className="absolute top-1/2 left-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/websiteicon.png"
              alt=""
              width={156}
              height={154}
              className="size-full drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
            />
          </div>
          <div ref={labelsRef} className="absolute inset-0">
            {steps.map((p, i) => (
              <span
                key={p.label}
                data-scroll
                data-lag={0.2 + i * 0.15}
                className="fx-rise absolute flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-sm whitespace-nowrap text-black shadow-sm"
                style={{ left: p.x, top: p.y }}
              >
                <span className="size-3 rounded-sm" style={{ background: p.color }} />
                {p.label}
              </span>
            ))}
          </div>
        </div>
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      </div>
    </div>
  );
}
