"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import "lenis/dist/lenis.css";

/**
 * Site-wide smooth scrolling (Lenis), kept in sync with GSAP ScrollTrigger
 * through gsap.ticker. Mounted once in the root layout.
 *
 * Every scroll animation on the site reads the native scroll position, which
 * Lenis drives, so they all pick up the same fluid, momentum-style motion.
 * Anchor links (#work, #contact…) glide to their sections. With reduced
 * motion, Lenis is skipped and the browser's normal scrolling is used.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
