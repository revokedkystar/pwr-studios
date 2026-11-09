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
 * to `--tp` (0 → 1). Each tool starts scattered and rotated, then flies into
 * its place on a ring (worked out in CSS from --tp, its --d delay and its
 * --k position on the ring), turning from grey to colour as it lands. The
 * whole ring turns as it forms, so the tools sweep round into a circle, with
 * each area taking its own arc. The title and a counter of how many tools
 * have landed sit in the middle. The last stretch holds the finished circle
 * before the page scrolls on.
 *
 * Without JavaScript or with reduced motion, --tp is never set and the CSS
 * fallback (1) shows the finished circle.
 */
type Props = {
  areas: Area[];
  /** Two-line title in the middle of the ring. */
  title?: [string, string];
  /** What the counter counts, e.g. "tools" or "companies". */
  unit?: string;
  /** id for the title, for anchors and aria-labelledby. */
  id?: string;
  /** "dark" for the black band, "light" for white sections. */
  theme?: "dark" | "light";
  /** Wide tiles, for wordmark logos rather than square icons. */
  wide?: boolean;
};

export function StackShowcase({
  areas,
  title = ["Development", "stack"],
  unit = "tools",
  id = "stack",
  theme = "dark",
  wide = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const light = theme === "light";
  // Only show area names when there is more than one area.
  const grouped = areas.length > 1;
  const tools = areas.flatMap((a) => a.tools.map((t) => ({ ...t, area: a.area })));
  const total = tools.length;

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
      // Finish forming the circle at 80% of the way through, then hold.
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

  return (
    <div
      ref={ref}
      className={`stack relative h-[280svh] ${light ? "stack-light text-black" : ""}`}
      style={{ "--flight": FLIGHT, "--step": `${360 / total}deg` } as CSSProperties}
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* Giant tool names sliding across behind the circle. */}
        <p
          aria-hidden
          className={`stack-ticker pointer-events-none absolute top-1/2 left-0 w-max text-[22vw] leading-none font-medium tracking-[-0.03em] whitespace-nowrap lg:text-[15vw] ${light ? "text-black/[0.04]" : "text-white/[0.045]"}`}
        >
          {tools.map((t) => t.name).join(" · ")}
        </p>

        <div className="stack-ring relative aspect-square w-[min(78svh,92vw,760px)]">
          {/* Centre: title, counter and the three areas. */}
          <div className="absolute inset-0 grid place-content-center text-center">
            <h2 id={id} className="stack-title font-medium tracking-[-0.01em]">
              {title[0]}
              <br />
              {title[1]}
            </h2>
            <p className={`stack-meta mt-[2.5cqmin] tabular-nums ${light ? "text-black/50" : "text-white/55"}`}>
              <span data-count className={light ? "text-black" : "text-white"}>
                {String(total).padStart(2, "0")}
              </span>{" "}
              / {String(total).padStart(2, "0")} {unit}
            </p>
            {grouped && (
              <ul className={`stack-label stack-meta mt-[2cqmin] max-sm:hidden ${light ? "text-black/45" : "text-white/45"}`}>
                {areas.map((a) => (
                  <li key={a.area}>
                    {a.area} <span className={light ? "text-black/30" : "text-white/30"}>{a.tools.length}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ul aria-labelledby={id}>
            {tools.map((t, i) => {
              // Deterministic scatter: spread across the screen, rotated.
              const style = {
                "--k": i,
                "--d": (i * STAGGER).toFixed(3),
                "--sx": `${((i * 37) % 11) * 8 - 40}vw`,
                "--sy": `${((i * 53) % 9) * 11 - 44}vh`,
                "--sr": `${((i * 29) % 7) * 30 - 90}deg`,
              } as CSSProperties;
              return (
                <li
                  key={t.name}
                  style={style}
                  tabIndex={0}
                  aria-label={grouped ? `${t.name}, ${t.area}` : t.name}
                  className={`stack-tile group absolute top-1/2 left-1/2 cursor-default rounded-xl outline-none hover:z-10 focus:z-10 focus-visible:ring-2 ${
                    wide ? "stack-tile-wide" : ""
                  } ${light ? "focus-visible:ring-black/40" : "focus-visible:ring-white/60"}`}
                >
                  <Image
                    src={t.src}
                    alt=""
                    width={wide ? 160 : 64}
                    height={64}
                    className="stack-icon size-full object-contain transition-transform duration-300 group-hover:scale-115 group-focus:scale-115"
                  />
                  {/* Name label, shown on hover (or tap / keyboard focus). */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 rounded-full px-3 py-1.5 text-xs whitespace-nowrap opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 ${
                      light ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                    {grouped && <span className={light ? "text-white/50" : "text-black/45"}> {t.area}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
