"use client";

import { useEffect, useRef } from "react";

/**
 * "Please scroll to continue" cue at the bottom of the hero. The hero is
 * pinned while its intro plays, so nothing moves for the first stretch of
 * scrolling; this tells visitors to keep going. It fades out as soon as
 * they start scrolling, and comes back if they return to the top.
 */
export function ScrollPrompt() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.dataset.hidden = window.scrollY > 24 ? "true" : "false";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <p
      ref={ref}
      className="scroll-prompt pointer-events-none flex flex-col items-center gap-2 text-[13px] tracking-[0.02em] text-black/55"
    >
      Please scroll to continue
      <svg viewBox="0 0 16 16" aria-hidden className="scroll-prompt__arrow size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </p>
  );
}
