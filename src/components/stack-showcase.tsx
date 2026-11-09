"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

type Tool = { name: string; src: string };
type Area = { area: string; tools: Tool[] };

/** Window over which each tile flies in (as a share of the section's progress). */
const FLIGHT = 0.42;
/** Delay between one tile starting and the next. */
const STAGGER = 0.028;

/**
 * Sticky "Development stack" showcase.
 *
 * The section is a few screens tall and its panel is sticky, so it stays
 * locked on screen while you scroll through it. Scroll progress is written
 * to `--tp` (0 → 1). Each tool tile starts scattered and rotated, then flies
 * into its place in the grid on its own staggered schedule (worked out in
 * CSS from --tp and its --d delay), turning from grey to colour as it lands.
 * A counter tracks how many have landed, and the area labels fade in at the
 * end. The last stretch of the section holds everything assembled before
 * the page scrolls on.
 *
 * Without JavaScript or with reduced motion, --tp is never set and the CSS
 * fallback (1) shows the finished, assembled grid.
 */
export function StackShowcase({ areas }: { areas: Area[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const total = areas.reduce((n, a) => n + a.tools.length, 0);

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
      // Finish assembling at 80% of the way through, then hold.
      const tp = Math.min(1, progress / 0.8);
      el.style.setProperty("--tp", tp.toFixed(4));
      let landed = 0;
      for (let i = 0; i < total; i++) if (tp >= i * STAGGER + FLIGHT) landed++;
      if (landed !== shown && counter) {
        shown = landed;
        counter.textContent = String(landed).padStart(2, "0");
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

  let index = 0;
  const names = areas.flatMap((a) => a.tools.map((t) => t.name));

  return (
    <div ref={ref} className="stack relative h-[260svh]" style={{ "--flight": FLIGHT } as CSSProperties}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {/* Giant tool names sliding across behind the grid. */}
        <p
          aria-hidden
          className="stack-ticker pointer-events-none absolute top-1/2 left-0 w-max text-[22vw] leading-none font-medium tracking-[-0.03em] whitespace-nowrap text-white/[0.045] lg:text-[15vw]"
        >
          {names.join(" · ")}
        </p>

        <div className="wrap relative">
          <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <h2 id="stack" className="text-[44px] leading-[0.95] font-medium tracking-[-0.01em] sm:text-6xl lg:text-7xl">
              Development stack
            </h2>
            <p className="text-sm text-white/55 tabular-nums">
              <span data-count className="text-white">
                {String(total).padStart(2, "0")}
              </span>{" "}
              / {String(total).padStart(2, "0")} tools assembled
            </p>
          </header>

          <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-3 lg:gap-4">
            {areas.map((a) => (
              <section key={a.area} aria-label={a.area}>
                <h3 className="stack-label text-sm text-white/55">{a.area}</h3>
                <ul className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                  {a.tools.map((t) => {
                    const i = index++;
                    // Deterministic scatter: spread across the screen, rotated.
                    const style = {
                      "--d": (i * STAGGER).toFixed(3),
                      "--sx": `${((i * 37) % 11) * 8 - 40}vw`,
                      "--sy": `${((i * 53) % 9) * 11 - 44}vh`,
                      "--sr": `${((i * 29) % 7) * 30 - 90}deg`,
                    } as CSSProperties;
                    return (
                      <li
                        key={t.name}
                        style={style}
                        className="stack-tile flex h-[84px] flex-col items-center justify-center gap-2 rounded-2xl bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:h-auto sm:aspect-square sm:gap-3"
                      >
                        <span className="grid size-10 place-items-center rounded-xl bg-white sm:size-14 sm:rounded-2xl">
                          <Image src={t.src} alt="" width={32} height={32} className="stack-icon size-6 object-contain sm:size-8" />
                        </span>
                        <span className="text-xs text-white/75 sm:text-sm">{t.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
