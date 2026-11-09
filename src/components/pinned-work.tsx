"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { PixelField } from "./pixel-field";
import { ArrowIcon, PillLink, Tag } from "./ui";

export type CaseStudy = {
  title: string;
  client: string;
  tags: string[];
  href: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  palette: string[];
  seed: number;
  dark: boolean;
};

/**
 * Pinned case-study showcase.
 *
 * The section is one screen tall per project. Its inner panel is sticky, so
 * it stays locked on screen while the page scrolls through the section, and
 * scroll progress flips through the projects one at a time. Once the last
 * project has been shown the section ends and the page scrolls on normally.
 *
 * Progress is written to a `--pos` CSS variable (0 → n-1, with a short pause
 * on each project); each slide works out its own offset from `--pos` in CSS:
 * the full-screen backdrops crossfade and slowly zoom, the text crossfades,
 * and each new screenshot wipes up inside the same frame. `--vis` (0 → 1)
 * fades the dark stage in as the section arrives and back out as it leaves,
 * so it blends into the sections around it with no hard edge.
 */
export function PinnedWork({ items }: { items: CaseStudy[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const slides = Array.from(section.querySelectorAll<HTMLElement>("[data-slide]"));
    const counter = section.querySelector<HTMLElement>("[data-counter]");
    const n = items.length;
    let raf = 0;
    let active = -1;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      // Hold on each project for a moment, then ease to the next.
      const raw = progress * (n - 1);
      const i = Math.min(n - 1, Math.floor(raw));
      const f = Math.min(1, Math.max(0, (raw - i - 0.2) / 0.6));
      const pos = i + f * f * (3 - 2 * f);
      section.style.setProperty("--pos", pos.toFixed(4));
      // Fade the stage in as the section arrives and out as it leaves.
      const vh = window.innerHeight;
      const enter = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.6)));
      const exit = Math.min(1, Math.max(0, (rect.bottom - vh * 0.15) / (vh * 0.6)));
      section.style.setProperty("--vis", Math.min(enter, exit).toFixed(4));

      const now = Math.round(pos);
      if (now !== active) {
        active = now;
        slides.forEach((s) => {
          const on = Number(s.dataset.slide) === now;
          s.style.pointerEvents = on ? "auto" : "none";
          s.setAttribute("aria-hidden", on ? "false" : "true");
          s.tabIndex = on ? 0 : -1;
        });
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
  }, [items.length]);

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected work"
      className="pinned relative z-0 -mt-20 sm:-mt-24"
      style={{ height: `${items.length * 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden text-white">
        {/* Full-screen backdrops, one per project, crossfading as you scroll. */}
        <div aria-hidden className="pin-stage absolute inset-0 bg-[#0a0a0a]">
          {items.map((c, i) => (
            <div key={c.title} className="pin-bg absolute inset-0" style={{ "--i": i } as CSSProperties}>
              <Image src={c.image} alt="" fill sizes="100vw" className="object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(10,10,10,0.35),rgba(10,10,10,0.85))]" />
        </div>

        <div className="pin-content wrap relative grid flex-1 grid-rows-[auto_1fr] gap-6 pt-24 pb-6 sm:pt-28 sm:pb-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:grid-rows-1 lg:gap-12">
          {/* Project text, cross-fading in step with the images. */}
          <div className="lg:self-center">
            <p className="flex items-baseline gap-3 text-sm text-white/55">
              Selected work
              <span className="tabular-nums text-white">
                <span data-counter>01</span>
                <span className="text-white/40"> / {String(items.length).padStart(2, "0")}</span>
              </span>
            </p>
            <div className="mt-4 grid sm:mt-6">
              {items.map((c, i) => (
                <div key={c.title} data-slide={i} className="pin-text [grid-area:1/1]" style={{ "--i": i } as CSSProperties}>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <Tag key={t} dark>
                        {t}
                      </Tag>
                    ))}
                  </div>
                  <h2 className="mt-3 text-[26px] leading-[1.12] font-medium tracking-[-0.01em] sm:text-[34px] lg:text-[40px]">
                    {c.title}
                  </h2>
                  <p className="mt-3 text-base text-white/60">{c.client}</p>
                  <div className="mt-6 max-sm:hidden">
                    <PillLink href={c.href} invert>
                      View project
                    </PillLink>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* One frame; each new project's screenshot wipes up inside it. */}
          <div className="relative flex min-h-0 items-center justify-center">
            <div className="relative aspect-[16/10] w-full max-w-[720px] overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              {items.map((c, i) => (
                <a
                  key={c.title}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  data-slide={i}
                  aria-label={`${c.title} (opens in a new tab)`}
                  className="pin-card group absolute inset-0 overflow-hidden rounded-[28px]"
                  style={{ "--i": i, zIndex: i + 1 } as CSSProperties}
                >
                  <PixelField palette={c.palette} seed={c.seed} cell={22} mode="flat" className="absolute inset-0 size-full" />
                  {/* The whole screenshot, uncropped, framed by the pixel pattern. */}
                  <div className="pin-shot absolute inset-[7%] flex items-center justify-center">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      width={c.width}
                      height={c.height}
                      sizes="(min-width: 1024px) 640px, 86vw"
                      className="fx-colour h-auto max-h-full w-auto max-w-full rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <span className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowIcon className="size-4" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
