"use client";

import { useEffect } from "react";

/**
 * Scroll-scrubbed animation driver.
 *
 * Every element with a `data-scroll` attribute gets three CSS variables,
 * updated as the page scrolls (once per animation frame):
 *
 *   --in   0 → 1 as the element rises from the bottom of the viewport to
 *          about 45% of the way up ("reveal" progress). `data-lag` (0–1)
 *          delays it, for staggering items in the same row.
 *   --p    0 → 1 across the element's whole trip through the viewport
 *          (used for parallax and rotation).
 *   --out  0 → 1 as the element scrolls off the top (used by the hero).
 *
 * The CSS in globals.css (`.fx-*` classes) turns these into motion. Without
 * JavaScript, or with reduced motion on, the variables are never set and
 * the CSS fallbacks show everything in its finished state.
 */
export function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let els: HTMLElement[] = [];
    let raf = 0;
    const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const lag = Number(el.dataset.lag || 0);
        const reveal = clamp((vh - r.top) / (vh * 0.45) - lag);
        el.style.setProperty("--in", reveal.toFixed(3));
        el.style.setProperty("--p", clamp((vh - r.top) / (vh + r.height)).toFixed(3));
        el.style.setProperty("--out", clamp(-r.top / r.height).toFixed(3));
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    els = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
