"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

type Logo = { name: string; src: string };

/** Share of the section's progress each company's spotlight takes. */
const WINDOW = 0.25;
/** Spotlights overlap: the next starts when this share of the last is done. */
const OVERLAP = 0.75;

/**
 * Sticky "Experience with" spotlight reel.
 *
 * The section is several screens tall and its panel is sticky, so it stays
 * locked on screen while you scroll. Scroll progress is written to `--dp`
 * (0 → 1). Each company then gets its own moment, one after another:
 *
 * 1. a black p*wr card rises from below, tilted, growing into a big card in
 *    the middle of the screen
 * 2. it flips over to reveal the logo in colour, with a ring pulsing out
 *    behind it and the company name sweeping across the background
 * 3. the logo shrinks and flies down into its place in the row, as the
 *    next card starts to rise
 *
 * The maths for each phase lives in globals.css (.deck-*), driven by --dp,
 * each card's --d start, and its --cx/--cy/--big: the offset from its row
 * slot to the middle of the panel and how much to enlarge it there, which
 * are measured here.
 *
 * Without JavaScript or with reduced motion, --dp is never set and the CSS
 * fallback (1) shows every logo docked in the row.
 */
export function LogoDeck({ logos }: { logos: Logo[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const total = logos.length;
  const step = WINDOW * OVERLAP;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = el.firstElementChild as HTMLElement;
    const slots = Array.from(el.querySelectorAll<HTMLElement>(".deck-card"));
    const counter = el.querySelector<HTMLElement>("[data-count]");
    let raf = 0;
    let shown = -1;

    // Where the middle of the panel is relative to each slot, and how big
    // to make the card there.
    const measure = () => {
      const p = panel.getBoundingClientRect();
      const target = Math.min(window.innerWidth * 0.62, 560);
      for (const s of slots) {
        const r = s.getBoundingClientRect();
        s.style.setProperty("--cx", `${p.left + p.width / 2 - (r.left + r.width / 2)}px`);
        s.style.setProperty("--cy", `${p.top + p.height * 0.46 - (r.top + r.height / 2)}px`);
        s.style.setProperty("--big", (target / r.width).toFixed(3));
      }
    };

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1;
      // Finish the reel a little before the end, then hold the full row.
      const dp = Math.min(1, progress / 0.92);
      el.style.setProperty("--dp", dp.toFixed(4));
      let docked = 0;
      for (let i = 0; i < total; i++) if (dp >= i * step + WINDOW - 0.001) docked++;
      if (docked !== shown && counter) {
        shown = docked;
        counter.textContent = String(docked).padStart(2, "0");
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      schedule();
    };
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
    };
  }, [total, step]);

  return (
    <div ref={ref} className="deck relative h-[560svh]" style={{ "--win": WINDOW } as CSSProperties}>
      <div className="sticky top-0 flex h-svh flex-col justify-between overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-14">
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

        <ul aria-labelledby="experience" className="wrap grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {logos.map((l, i) => {
            // On two-column screens an odd last card spans both columns.
            const spans = i === logos.length - 1 && logos.length % 2 === 1;
            return (
              <li
                key={l.name}
                className={`deck-card ${spans ? "max-lg:col-span-2" : ""}`}
                style={
                  {
                    "--d": (i * step).toFixed(4),
                    "--tilt": `${[-18, 14, -10, 16, -12][i % 5]}deg`,
                    "--z": i + 1,
                  } as CSSProperties
                }
              >
                {/* Giant name sweeping behind the card while it's in the spotlight. */}
                <span
                  aria-hidden
                  className="deck-spot pointer-events-none absolute top-[46%] left-1/2 -z-10 text-[22vw] leading-none font-medium tracking-[-0.03em] whitespace-nowrap text-black/[0.05] lg:text-[16vw]"
                >
                  {l.name}
                </span>

                <div className="deck-move relative">
                  <span aria-hidden className="deck-pulse absolute top-1/2 left-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black/15" />
                  <div className={`deck-flip relative aspect-[5/2] ${spans ? "max-lg:aspect-[5/1]" : ""}`}>
                    {/* Front: the company logo on its own, no card behind it. */}
                    <div className="deck-face absolute inset-0">
                      <span className="absolute inset-x-[3%] inset-y-[10%]">
                        <Image src={l.src} alt={l.name} fill sizes="(min-width: 1024px) 600px, 70vw" className="deck-logo object-contain" />
                      </span>
                    </div>
                    {/* Back: black with the p*wr mark. */}
                    <div aria-hidden className="deck-face deck-back absolute inset-0 rounded-2xl bg-black">
                      <span className="absolute inset-x-0 inset-y-[30%]">
                        <Image src="/websiteicon.png" alt="" fill sizes="120px" className="object-contain" />
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
