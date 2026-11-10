"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PixelField } from "@/components/pixel-field";

export type Place = {
  label: string;
  color: string;
  /** Where the tag sits on the flat wheel, as a share of its size. */
  x: string;
  y: string;
  /** Where the tag sits on the globe. */
  lat: number;
  lon: number;
  /** Which side of its country the tag sits on the globe (default right). */
  side?: "left" | "right";
};

/*
 * The pixel globe, pinned while it scrolls past.
 *
 * Scrolling through the tall outer box keeps the globe locked in the middle
 * of the screen, spinning with the scroll, and plays this through:
 *
 *   0.00 – 0.04  a smaller globe, the size of the old wheel
 *   0.04 – 0.44  it grows to fill most of the screen
 *   0.44 – 0.56  the full-size globe turns with the scroll
 *   0.56 – 0.96  it shrinks back down to the smaller globe
 *
 * The tags stay on their countries throughout, turning with the globe.
 *
 * The globe is drawn with the wheel's own pixel style: the same three greys,
 * 14px cells and 2px checkerboard dithering between neighbouring greys. Land
 * comes from rough continent outlines, so the tags sit on the right countries.
 * With reduced motion on, nothing is pinned and the plain pixel wheel (with
 * the tags in their wheel positions) is shown instead.
 */

// Darkest grey matches the section background (#050505).
const PALETTE = ["#050505", "#4a4a4a", "#d4d4d4"];
const CELL = 14;
const DITHER = 2;
const TILT = 0.42; // tips the north pole towards the viewer
const LIGHT = (() => {
  const v = [-0.5, -0.55, 0.67];
  const l = Math.hypot(v[0], v[1], v[2]);
  return v.map((n) => n / l);
})();
const DEG = Math.PI / 180;
// The longitude facing the viewer: the Atlantic at the globe's biggest, so
// all three tags are in view, swinging 70° either side as the scroll goes on.
const centreLon = (t: number) => (-40 + (t - 0.5) * 140) * DEG;

// Rough continent outlines as [longitude, latitude] points.
const LAND: [number, number][][] = [
  // North America
  [[-168, 66], [-162, 70], [-140, 70], [-120, 74], [-95, 72], [-80, 73], [-62, 66], [-64, 60], [-56, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-83, 29], [-90, 30], [-97, 27], [-97, 22], [-92, 18], [-87, 21], [-88, 15], [-83, 9], [-79, 8], [-86, 12], [-92, 14], [-105, 20], [-110, 24], [-114, 31], [-117, 32], [-124, 40], [-124, 48], [-130, 55], [-140, 60], [-152, 58], [-165, 60]],
  // Greenland
  [[-55, 60], [-44, 60], [-20, 70], [-18, 80], [-35, 83], [-60, 82], [-72, 78], [-55, 68]],
  // South America
  [[-80, 9], [-72, 12], [-60, 10], [-50, 0], [-35, -5], [-39, -15], [-48, -26], [-58, -35], [-65, -42], [-68, -55], [-74, -50], [-72, -30], [-71, -18], [-77, -12], [-81, -5], [-78, 2]],
  // Europe and Asia
  [[-10, 36], [-9, 43], [-2, 44], [-4, 48], [2, 51], [8, 54], [10, 57], [5, 62], [15, 69], [28, 71], [40, 67], [60, 69], [80, 73], [105, 78], [140, 72], [180, 69], [180, 65], [160, 60], [155, 51], [142, 47], [135, 43], [128, 35], [122, 40], [121, 31], [110, 21], [106, 11], [100, 13], [103, 1], [98, 8], [92, 22], [80, 15], [77, 8], [73, 20], [66, 25], [57, 26], [52, 30], [48, 30], [56, 25], [59, 22], [52, 16], [43, 13], [39, 21], [34, 28], [35, 36], [27, 37], [26, 41], [23, 37], [20, 40], [13, 46], [16, 41], [12, 38], [8, 44], [3, 43], [-1, 38], [-6, 36]],
  // Africa
  [[-17, 21], [-10, 30], [-6, 36], [10, 37], [20, 31], [32, 31], [35, 28], [43, 12], [51, 12], [40, -15], [35, -25], [20, -35], [18, -30], [12, -17], [13, -5], [9, 4], [-8, 5], [-17, 14]],
  // Great Britain and Ireland
  [[-5, 50], [1, 51], [2, 53], [-1, 55], [-2, 58], [-5, 59], [-6, 56], [-3, 54], [-5, 52]],
  [[-10, 52], [-6, 52], [-6, 55], [-10, 55]],
  // Australia, Japan, the larger islands
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [140, -38], [130, -32], [115, -34]],
  [[130, 31], [140, 35], [142, 40], [141, 45], [139, 38], [132, 34]],
  [[109, 1], [118, 7], [119, -1], [115, -4], [110, -3]],
  [[95, 5], [106, -6], [101, -3]],
  [[44, -25], [50, -15], [49, -12], [44, -17]],
  [[166, -46], [174, -41], [178, -38], [172, -34], [168, -44]],
];

// Land mask on a 2° grid, built the first time the globe is drawn.
let mask: Uint8Array | null = null;
function landMask() {
  if (mask) return mask;
  mask = new Uint8Array(180 * 90);
  for (let j = 0; j < 90; j++) {
    const lat = 89 - j * 2;
    for (let i = 0; i < 180; i++) {
      const lon = -179 + i * 2;
      let inside = lat < -68; // Antarctica
      for (const poly of LAND) {
        if (inside) break;
        for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
          const [xa, ya] = poly[a];
          const [xb, yb] = poly[b];
          if (ya > lat !== yb > lat && lon < ((xb - xa) * (lat - ya)) / (yb - ya) + xa) inside = !inside;
        }
      }
      mask[j * 180 + i] = inside ? 1 : 0;
    }
  }
  return mask;
}

function isLand(lat: number, lon: number) {
  const m = landMask();
  const j = Math.min(89, Math.max(0, Math.floor((90 - lat / DEG) / 2)));
  let i = Math.floor((lon / DEG + 180) / 2) % 180;
  if (i < 0) i += 180;
  return m[j * 180 + i] === 1;
}

function hash(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263 + 5 * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth noise over latitude/longitude, for the wheel's mottled texture. */
function mottle(lat: number, lon: number) {
  const x = lon * 2.2;
  const y = lat * 2.2;
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smoothstep = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Like smoothstep, but flatter at both ends, so motion eases in and out more gently. */
const smootherstep = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** A point on the globe, in screen units: x right, y down, z towards the viewer. */
function project(lat: number, lon: number, spin: number) {
  const wx = Math.cos(lat) * Math.sin(lon);
  const wy = -Math.sin(lat);
  const wz = Math.cos(lat) * Math.cos(lon);
  // Undo the spin, then the tilt (the inverse of drawGlobe's turn).
  const x1 = wx * Math.cos(spin) - wz * Math.sin(spin);
  const z1 = wx * Math.sin(spin) + wz * Math.cos(spin);
  return {
    x: x1,
    y: wy * Math.cos(TILT) + z1 * Math.sin(TILT),
    z: -wy * Math.sin(TILT) + z1 * Math.cos(TILT),
  };
}

/*
 * Background: a pixel starfield behind the wheel and globe. Stars are square
 * pixels in the site's greys on three depth layers. They twinkle, drift, slide
 * with the scroll and sweep sideways as the globe turns (nearer layers move
 * more), and brighten and push outwards while the globe is open. Now and then
 * a pixel shooting star streaks across.
 */
const STAR_GREYS = ["#4a4a4a", "#8f8f8f", "#d4d4d4"];
const STARS = Array.from({ length: 260 }, (_, i) => {
  const layer = i % 3; // 0 far, 1 middle, 2 near
  return {
    x: hash(i, 11),
    y: hash(i, 29),
    layer,
    depth: [0.35, 0.65, 1][layer],
    size: [2, 3, 4][layer],
    rate: 0.6 + hash(i, 47) * 1.8,
    phase: hash(i, 53) * Math.PI * 2,
  };
});
const wrap = (n: number) => n - Math.floor(n);

export type GlobeLine = { text: string; from: number; to: number };

export function ProcessGlobe({ places, lines = [] }: { places: Place[]; lines?: GlobeLine[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const wheel = wheelRef.current;
    const canvas = canvasRef.current;
    const sky = skyRef.current;
    const tags = tagRefs.current;
    // Each caption's words, so they can rise in and out one after another.
    const lineEls = Array.from(linesRef.current?.querySelectorAll<HTMLElement>("[data-line]") ?? []);
    const lineWords = lineEls.map((el) => Array.from(el.querySelectorAll<HTMLElement>("[data-word]")));
    let layoutKey = "";

    /*
     * Place the captions beside the globe at its full size, alternating left
     * and right, sized to the space there. When there's no room beside it
     * (a phone held upright), left-hand lines go above the globe and
     * right-hand lines below it.
     */
    const layoutLines = (w: number, h: number, cx: number, cy: number, rMax: number) => {
      const key = `${w}|${h}|${Math.round(cx)}|${Math.round(cy)}|${Math.round(rMax)}`;
      if (key === layoutKey) return;
      layoutKey = key;
      const edge = Math.max(16, w * 0.03);
      const gap = Math.max(20, w * 0.02);
      const leftRoom = cx - rMax - gap - edge;
      const rightRoom = w - (cx + rMax) - gap - edge;
      const room = Math.min(leftRoom, rightRoom);
      lineEls.forEach((el, i) => {
        const left = i % 2 === 0;
        const st = el.style;
        st.left = st.right = st.top = st.bottom = "";
        if (room >= 170) {
          st.width = `${room}px`;
          st.fontSize = `${Math.round(Math.min(72, Math.max(28, room / 4.4)))}px`;
          st.top = "50%";
          st.translate = "0 -50%";
          st.textAlign = left ? "left" : "right";
          if (left) st.left = `${edge}px`;
          else st.right = `${edge}px`;
        } else {
          const header = 64;
          const top = header;
          const above = Math.max(0, cy - rMax - top);
          const below = Math.max(0, h - (cy + rMax));
          const size = Math.round(Math.min(48, Math.max(30, w / 10)));
          st.width = `${w - edge * 2}px`;
          st.left = `${edge}px`;
          st.fontSize = `${size}px`;
          st.textAlign = "center";
          st.translate = "0 -50%";
          // Centred in the space above or below the globe, but always clear
          // of the menu bar and the bottom edge, even when that space is thin.
          const clear = size * 0.75 + 8;
          st.top = left ? `${Math.max(top + clear, top + above / 2)}px` : `${Math.min(h - clear, h - below / 2)}px`;
        }
      });
    };
    if (!outer || !wheel || !canvas || !sky) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    const skyCtx = sky.getContext("2d");
    if (!ctx || !skyCtx) return;

    let dpr = 1;
    let raf = 0;
    let visible = false;
    // Scroll progress as drawn: it glides after the real scroll position
    // instead of jumping with it, which smooths out uneven scroll steps.
    let shown = -1;
    let last = 0;
    const patterns = new Map<string, CanvasPattern>();

    // The same 2px checkerboard the wheel uses between two greys.
    const checker = (a: string, b: string) => {
      const key = `${a}|${b}|${dpr}`;
      const hit = patterns.get(key);
      if (hit) return hit;
      const s = Math.max(1, Math.round(DITHER * dpr));
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

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      sky.width = Math.round(sky.clientWidth * dpr);
      sky.height = Math.round(sky.clientHeight * dpr);
      patterns.clear();
    };

    const drawGlobe = (cx: number, cy: number, radius: number, spin: number) => {
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);
      const cosL = Math.cos(spin);
      const sinL = Math.sin(spin);
      const steps = PALETTE.length * 2 - 1;
      const half = Math.ceil(radius / CELL);
      const px = CELL * dpr;
      // Cells are lined up on the globe's centre, so it grows evenly.
      const ox = cx * dpr - half * px;
      const oy = cy * dpr - half * px;

      for (let j = 0; j < half * 2; j++) {
        const sy = ((j - half + 0.5) * CELL) / radius;
        for (let i = 0; i < half * 2; i++) {
          const sx = ((i - half + 0.5) * CELL) / radius;
          const d = sx * sx + sy * sy;
          if (d > 1) continue;
          const sz = Math.sqrt(1 - d);
          // Tip the globe towards the viewer, then spin it about its axis.
          const y1 = sy * cosT - sz * sinT;
          const z1 = sy * sinT + sz * cosT;
          const x2 = sx * cosL + z1 * sinL;
          const z2 = -sx * sinL + z1 * cosL;
          const lat = Math.asin(Math.max(-1, Math.min(1, -y1)));
          const lon = Math.atan2(x2, z2);
          const lit = clamp(sx * LIGHT[0] + sy * LIGHT[1] + sz * LIGHT[2]);
          const n = mottle(lat, lon) - 0.5;
          const value = isLand(lat, lon) ? 0.62 + 0.4 * lit + n * 0.3 : 0.16 + 0.34 * lit + n * 0.4;
          const idx = Math.min(steps - 1, Math.max(0, Math.floor(value * steps)));
          ctx.fillStyle =
            idx % 2 === 0 ? PALETTE[idx / 2] : checker(PALETTE[(idx - 1) / 2], PALETTE[(idx + 1) / 2]);
          ctx.fillRect(Math.round(ox + i * px), Math.round(oy + j * px), Math.ceil(px), Math.ceil(px));
        }
      }
    };

    const drawSky = (now: number, t: number, morph: number, spin: number) => {
      const w = sky.width;
      const h = sky.height;
      skyCtx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const unit = Math.max(w, h);
      // Brighter and pushed outwards while the globe is open.
      const glow = 0.45 + 0.55 * morph;
      const push = 1 + 0.18 * morph;
      for (const st of STARS) {
        // Drift, scroll and globe turn, scaled by depth (nearer moves more).
        const sx = wrap(st.x + now * 0.000004 * st.depth - spin * 0.06 * st.depth);
        const sy = wrap(st.y - t * 0.45 * st.depth);
        let x = sx * w;
        let y = sy * h;
        x = cx + (x - cx) * push;
        y = cy + (y - cy) * push;
        const twinkle = 0.5 + 0.5 * Math.sin(now * 0.0015 * st.rate + st.phase);
        // Stepped brightness, so stars flicker between greys like pixels do.
        const level = Math.min(2, Math.floor(twinkle * (st.layer + 1.4)));
        if (level < 0) continue;
        skyCtx.globalAlpha = glow * (0.35 + 0.65 * twinkle);
        skyCtx.fillStyle = STAR_GREYS[level];
        const size = Math.round(st.size * dpr);
        // Snap to whole pixels so stars stay crisp squares.
        skyCtx.fillRect(Math.round(x), Math.round(y), size, size);
      }
      // A shooting star every few seconds, at a seeded spot and angle.
      const period = 4200;
      const n = Math.floor(now / period);
      const life = (now % period) / 900;
      if (life < 1 && hash(n, 71) > 0.35) {
        const x0 = (0.15 + hash(n, 73) * 0.7) * w;
        const y0 = (0.05 + hash(n, 79) * 0.4) * h;
        const ang = 0.35 + hash(n, 83) * 0.5;
        const travel = unit * 0.35 * life;
        const cell = Math.round(3 * dpr);
        for (let k = 0; k < 10; k++) {
          const d = travel - k * cell * 2.2;
          if (d < 0) break;
          skyCtx.globalAlpha = (1 - life) * (1 - k / 10) * glow;
          skyCtx.fillStyle = STAR_GREYS[k < 2 ? 2 : k < 5 ? 1 : 0];
          skyCtx.fillRect(Math.round(x0 + Math.cos(ang) * d), Math.round(y0 + Math.sin(ang) * d), cell, cell);
        }
      }
      skyCtx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = visible ? requestAnimationFrame(frame) : 0;
      const vh = window.innerHeight;
      const box = outer.getBoundingClientRect();
      const target = clamp(-box.top / Math.max(1, box.height - vh));
      const dt = Math.min(100, last ? now - last : 16);
      last = now;
      if (shown < 0) shown = target;
      shown += (target - shown) * (1 - Math.exp(-dt / 140));
      if (Math.abs(target - shown) < 0.0005) shown = target;
      const t = shown;

      // Longer, overlapping grow and shrink phases with gentle ends.
      const morph = Math.min(smootherstep(0.04, 0.44, t), 1 - smootherstep(0.56, 0.96, t));
      const spin = centreLon(t);

      const c = canvas.getBoundingClientRect();
      const r = wheel.getBoundingClientRect();
      const r0 = r.width / 2;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // Grows to most of the screen, but never taller than it.
      const rMax = Math.max(Math.min(w, h) * 0.44, Math.min(r0 * 1.55, h * 0.44));
      const radius = r0 + (rMax - r0) * morph;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSky(now, t, morph, spin);

      layoutLines(w, h, r.left + r0 - c.left, r.top + r.height / 2 - c.top, rMax);

      // Captions: words rise in one after another, then lift away.
      lines.forEach((line, i) => {
        const words = lineWords[i];
        if (!words) return;
        words.forEach((word, j) => {
          const enter = smootherstep(line.from + j * 0.012, line.from + j * 0.012 + 0.06, t);
          const leave = smootherstep(line.to - 0.06 + j * 0.008, line.to + j * 0.008, t);
          const shown = enter * (1 - leave);
          word.style.opacity = String(shown);
          word.style.translate = `0 ${((1 - enter) * 0.7 - leave * 0.5).toFixed(3)}em`;
          word.style.filter = shown > 0.99 ? "none" : `blur(${((1 - shown) * 8).toFixed(1)}px)`;
        });
      });

      // Tags sit on their countries and turn with the globe.
      places.forEach((p, i) => {
        const tag = tags[i];
        if (!tag) return;
        const at = project(p.lat * DEG, p.lon * DEG, spin);
        tag.style.left = `${r0 + at.x * radius}px`;
        tag.style.top = `${r.height / 2 + at.y * radius}px`;
        // The tag's coloured square marks the spot, with the label running
        // off to one side so neighbouring tags don't collide.
        tag.style.translate = p.side === "left" ? "calc(-100% + 14px) -50%" : "-14px -50%";
        // Fade out round the back of the globe.
        tag.style.setProperty("--face", String(smoothstep(-0.05, 0.2, at.z)));
      });

      drawGlobe(r.left + r0 - c.left, r.top + r.height / 2 - c.top, radius, spin);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        // Start from where the page is, not from an old position.
        shown = -1;
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    });

    resize();
    io.observe(outer);
    window.addEventListener("resize", resize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [places, lines]);

  return (
    <div ref={outerRef} className="relative h-[300svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto">
        {/* Starfield, behind the wheel and globe. */}
        <canvas
          ref={skyRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          style={{ imageRendering: "pixelated" }}
        />
        <div ref={wheelRef} className="relative aspect-square w-[min(520px,82vw,72svh)]">
          {/* The flat pixel wheel and logo: only shown with reduced motion. */}
          <div className="absolute inset-0 overflow-hidden rounded-full motion-safe:hidden">
            <PixelField palette={PALETTE} cell={CELL} scale={0.13} seed={5} speed={0.01} className="size-full" />
          </div>
          <div className="absolute top-1/2 left-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2 motion-safe:hidden">
            <Image
              src="/websiteicon.png"
              alt=""
              width={156}
              height={154}
              className="size-full drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
            />
          </div>
          {/* Above the globe canvas, which comes later in the panel. */}
          <div className="absolute inset-0 z-10">
            {places.map((p, i) => (
              <span
                key={p.label}
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="absolute"
                style={{ left: p.x, top: p.y, opacity: "var(--face, 1)" }}
              >
                <span
                  data-scroll
                  data-lag={0.2 + i * 0.15}
                  className={`fx-rise flex items-center gap-1.5 rounded-md ${p.side === "left" ? "flex-row-reverse" : ""} bg-white px-2 py-1 text-sm whitespace-nowrap text-black shadow-sm`}
                >
                  <span className="size-3 rounded-sm" style={{ background: p.color }} />
                  {p.label}
                </span>
              </span>
            ))}
          </div>
        </div>
        {/* Captions beside the globe; screen readers get them once, as plain text. */}
        {lines.length > 0 && (
          <>
            <p className="sr-only">{lines.map((l) => l.text).join(". ")}.</p>
            <div
              ref={linesRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 motion-reduce:hidden"
            >
              {lines.map((l) => (
                <p
                  key={l.text}
                  data-line
                  className="absolute font-serif text-[44px] leading-[0.95] tracking-[-0.01em] text-white italic [text-shadow:0_2px_28px_#050505,0_0_10px_#050505]"
                >
                  {l.text.split(" ").map((w, j, all) => (
                    <span key={j} data-word className="inline-block opacity-0">
                      {w}
                      {j < all.length - 1 ? "\u00a0" : ""}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </>
        )}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}
