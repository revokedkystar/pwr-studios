"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowIcon } from "./ui";

export type CaseStudy = {
  title: string;
  summary: string;
  client: string;
  tags: string[];
  live: string;
  repo: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  bg: string;
};

/*
 * Pinned "Selected work" showcase.
 *
 * The section is about a screen tall per project and its panel is sticky,
 * so it stays locked on screen while scrolling cycles through the websites.
 * Scroll progress becomes `--pos` (0 → n-1, holding briefly on each project);
 * each slide works out its own offset `--t` from it in CSS:
 *
 *   - the next site's browser window rises from below and tilts flat into
 *     place, while the one before sinks back, shrinks and blurs
 *   - the project text cross-fades with a small rise
 *   - the background colour flows between the projects' `bg` colours, and the
 *     text flips between dark and light to stay readable on it
 *
 * After the last project the background eases back to white, so the section
 * blends into the white section after it.
 *
 * Each project links to its live website and its GitHub repo, and the list of
 * projects (with a progress bar each) jumps straight to one.
 */

const HOLD = 0.22; // share of each step spent holding on a project
// Extra scroll after the last project, in steps, during which the background
// eases back to EXIT_BG so the section blends into the white section after it.
const EXIT = 0.45;
const EXIT_BG: [number, number, number] = [255, 255, 255];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.23 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.13.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export function PinnedWork({ items }: { items: CaseStudy[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section || !panel) return;
    const slides = Array.from(section.querySelectorAll<HTMLElement>("[data-slide]"));
    const bars = Array.from(section.querySelectorAll<HTMLElement>("[data-bar]"));
    const navItems = Array.from(section.querySelectorAll<HTMLElement>("[data-nav]"));
    const counter = section.querySelector<HTMLElement>("[data-counter]");
    const colours = items.map((c) => hexToRgb(c.bg));
    const n = items.length;
    let raf = 0;
    let active = -1;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      // Hold on each project for a moment, then ease to the next.
      const total = progress * (n - 1 + EXIT);
      const raw = Math.min(n - 1, total);
      const i = Math.min(n - 1, Math.floor(raw));
      const f = Math.min(1, Math.max(0, (raw - i - HOLD / 2) / (1 - HOLD)));
      const pos = i + f * f * (3 - 2 * f);
      section.style.setProperty("--pos", pos.toFixed(4));

      // Background flows between the projects' colours; text flips for contrast.
      const a = colours[Math.min(n - 1, Math.floor(pos))];
      const b = colours[Math.min(n - 1, Math.floor(pos) + 1)];
      const m = pos - Math.floor(pos);
      let rgb = a.map((v, k) => Math.round(v + (b[k] - v) * m));
      // Past the last project, fade the background back to white.
      const out = Math.min(1, Math.max(0, (total - (n - 1)) / EXIT));
      if (out > 0) {
        const e = out * out * (3 - 2 * out);
        rgb = rgb.map((v, k) => Math.round(v + (EXIT_BG[k] - v) * e));
      }
      panel.style.backgroundColor = `rgb(${rgb.join(",")})`;
      const light = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
      const dark = light < 0.5 ? 1 : 0;
      const ink = dark > 0.5 ? "#ffffff" : "#0a0a0a";
      panel.style.color = ink;
      panel.style.setProperty("--ink", ink);
      panel.style.setProperty("--bgc", `rgb(${rgb.join(",")})`);

      // Progress bars: each fills as its project arrives, and stays full.
      bars.forEach((bar, k) => {
        const fill = Math.min(1, Math.max(0, pos - k + 1));
        bar.style.scale = `${fill.toFixed(3)} 1`;
      });

      const now = Math.round(pos);
      if (now !== active) {
        active = now;
        slides.forEach((s) => {
          const on = Number(s.dataset.slide) === now;
          s.inert = !on;
          s.setAttribute("aria-hidden", on ? "false" : "true");
        });
        navItems.forEach((el, k) => el.setAttribute("aria-current", k === now ? "true" : "false"));
        if (counter) counter.textContent = String(now + 1).padStart(2, "0");
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  // Scroll to the middle of a project's hold.
  const jumpTo = (k: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const progress = items.length > 1 ? k / (items.length - 1 + EXIT) : 0;
    const top = section.getBoundingClientRect().top + window.scrollY + travel * progress;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const total = String(items.length).padStart(2, "0");

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected work"
      className="work relative z-0 -mt-20 sm:-mt-24"
      style={{ height: `${Math.round((items.length + EXIT) * 110)}svh` }}
    >
      <div
        ref={panelRef}
        className="sticky top-0 h-svh overflow-hidden text-[#0a0a0a] transition-[color] duration-300"
        style={{ backgroundColor: items[0]?.bg, "--bgc": items[0]?.bg } as CSSProperties}
      >
        <div className="wrap grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-5 pt-24 pb-6 sm:pt-28 sm:pb-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-x-14">
          {/* Project text, cross-fading in step with the windows. */}
          <div className="relative lg:self-center">
            <p className="flex items-baseline gap-3 text-sm opacity-60">
              Selected work
              <span className="tabular-nums">
                <span data-counter>01</span> / {total}
              </span>
            </p>
            <div className="mt-4 grid sm:mt-6">
              {items.map((c, i) => (
                <div key={c.title} data-slide={i} className="work-text [grid-area:1/1]" style={{ "--i": i } as CSSProperties}>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span key={t} className="work-tag rounded-md px-1.5 py-0.5 text-[13px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-3 text-[30px] leading-[1.05] font-medium tracking-[-0.02em] sm:text-[44px] lg:text-[52px]">
                    {c.title}
                  </h2>
                  <p className="mt-3 max-w-[38ch] text-[15px] leading-snug opacity-65 sm:text-base max-lg:line-clamp-2">
                    {c.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 sm:mt-7">
                    <a
                      href={c.live}
                      target="_blank"
                      rel="noreferrer"
                      className="work-btn-primary group inline-flex h-12 items-center gap-2 rounded-full pr-1.5 pl-5 text-[15px] font-medium transition-transform hover:-translate-y-0.5"
                    >
                      Visit website
                      <span className="work-btn-dot grid size-8 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45">
                        <ArrowIcon className="size-3.5" />
                      </span>
                    </a>
                    <a
                      href={c.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="work-btn-ghost inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-transform hover:-translate-y-0.5"
                    >
                      <GitHubMark className="size-4" />
                      View code
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser windows: the next one rises and tilts into place. */}
          <div className="work-stage relative flex min-h-0 items-center justify-center lg:row-span-2">
            {/* Big project number behind the window. */}
            <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
              {items.map((c, i) => (
                <span
                  key={c.title}
                  className="work-num [grid-area:1/1] text-[38vw] leading-none font-medium tracking-[-0.06em] tabular-nums lg:text-[26vw]"
                  style={{ "--i": i } as CSSProperties}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </div>

            <div className="relative aspect-[16/11] max-h-full w-full max-w-[860px] [perspective:1600px]">
              {items.map((c, i) => (
                <a
                  key={c.title}
                  href={c.live}
                  target="_blank"
                  rel="noreferrer"
                  data-slide={i}
                  aria-label={`Visit the ${c.title} website (opens in a new tab)`}
                  className="work-card group absolute inset-0 flex flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.08)] sm:rounded-[22px]"
                  style={{ "--i": i, zIndex: i + 1 } as CSSProperties}
                >
                  {/* Browser bar with the real address. */}
                  <div className="flex h-9 shrink-0 items-center gap-3 border-b border-black/[0.07] bg-[#f4f4f4] px-3 sm:h-11 sm:px-4">
                    <span className="flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-black/15" />
                      <span className="size-2.5 rounded-full bg-black/15" />
                      <span className="size-2.5 rounded-full bg-black/15" />
                    </span>
                    <span className="mx-auto flex max-w-[60%] items-center gap-1.5 truncate rounded-md bg-white px-3 py-1 text-[12px] text-black/60 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {host(c.live)}
                    </span>
                    <span className="grid size-6 place-items-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowIcon className="size-3" />
                    </span>
                  </div>
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(min-width: 1024px) 860px, 92vw"
                      className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Project list with a progress bar each; tap to jump to one. */}
          <ol className="grid grid-cols-3 gap-3 lg:self-end">
            {items.map((c, i) => (
              <li key={c.title}>
                <button
                  type="button"
                  data-nav
                  onClick={() => jumpTo(i)}
                  className="work-nav tap-area group w-full text-left"
                >
                  <span className="work-track block h-[3px] overflow-hidden rounded-full">
                    <span data-bar className="work-bar block h-full origin-left rounded-full" style={{ scale: i === 0 ? "1 1" : "0 1" }} />
                  </span>
                  <span className="mt-2 flex gap-2 text-[12px] leading-tight sm:text-[13px]">
                    <span className="tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span>
                    <span className="truncate opacity-60 transition-opacity group-hover:opacity-100 group-aria-[current=true]:opacity-100">
                      {c.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
