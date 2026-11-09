"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

type Logo = { name: string; src: string };

/** Share of the section's progress each card takes to rise and flip. */
const DEAL = 0.34;
/** Delay between one card and the next. */
const STAGGER = 0.12;

/**
 * Sticky "Experience with" deck.
 *
 * The section is a few screens tall and its panel is sticky, so it stays
 * locked while you scroll through it. Scroll progress is written to `--dp`
 * (0 → 1). Each company is a card that rises from below the screen at a tilt
 * and flips over as it arrives: the back is black with the p*wr mark, the
 * front is the company logo, which comes into colour as it lands. A counter
 * tracks how many cards are face up. The last stretch holds the finished row.
 *
 * Without JavaScript or with reduced motion, --dp is never set and the CSS
 * fallback (1) shows every card face up.
 */
export function LogoDeck({ logos }: { logos: Logo[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const total = logos.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const counter = el.querySelector<HTMLElement>("[data-count]");
    let raf = 0;
    let shown = -1;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1;
      // Finish dealing at 85% of the way through, then hold.
      const dp = Math.min(1, progress / 0.85);
      el.style.setProperty("--dp", dp.toFixed(4));
      let up = 0;
      for (let i = 0; i < total; i++) if (dp >= i * STAGGER + DEAL * 0.6) up++;
      if (up !== shown && counter) {
        shown = up;
        counter.textContent = String(up).padStart(2, "0");
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
  }, [total]);

  return (
    <div ref={ref} className="deck relative h-[240svh]" style={{ "--deal": DEAL } as CSSProperties}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="wrap">
          <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
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

          <ul aria-labelledby="experience" className="deck-row mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-5">
            {logos.map((l, i) => {
              // On two-column screens an odd last card spans both columns.
              const spans = i === logos.length - 1 && logos.length % 2 === 1;
              return (
              <li
                key={l.name}
                className={`deck-card ${spans ? "max-lg:col-span-2" : ""}`}
                style={{ "--d": (i * STAGGER).toFixed(3), "--tilt": `${[-14, 9, -6, 12, -10][i % 5]}deg` } as CSSProperties}
              >
                <div className={`deck-flip relative aspect-[4/3] ${spans ? "max-lg:aspect-[32/9]" : "max-lg:aspect-[16/9]"}`}>
                  {/* Front: the company logo. */}
                  <div className="deck-face absolute inset-0 grid place-items-center rounded-2xl bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                    <span className="absolute inset-x-[12%] inset-y-[30%]">
                        <Image src={l.src} alt={l.name} fill sizes="200px" className="deck-logo object-contain" />
                      </span>
                  </div>
                  {/* Back: black with the p*wr mark. */}
                  <div aria-hidden className="deck-face deck-back absolute inset-0 grid place-items-center rounded-2xl bg-black">
                    <Image src="/websiteicon.png" alt="" width={156} height={154} className="h-[30%] w-auto opacity-90" />
                  </div>
                </div>
                <p className="deck-name mt-3 text-sm text-black/60">{l.name}</p>
              </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
