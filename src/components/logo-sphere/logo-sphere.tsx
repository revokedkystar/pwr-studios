"use client";

/*
 * "Experience with" section with a scroll-driven 3D logo sphere.
 *
 *   HTML structure → this file
 *   CSS            → ./logo-sphere.css (colour, font and sphere-size variables)
 *   JS             → ./scene.ts (Three.js + GSAP ScrollTrigger; smooth scroll is site-wide)
 *
 * The section starts as a headline, a counter and a row of logos. Scrolling
 * pins it and lifts the logos onto a spinning sphere; see scene.ts.
 */
import { useEffect, useRef } from "react";
import { createLogoSphere } from "./scene";
import "./logo-sphere.css";

export type Company = {
  /** Company name: used for the logo's alt text. */
  name: string;
  /** Logo file, ideally an SVG or PNG with a transparent background. */
  src: string;
};

/*
 * SWAP LOGOS / COMPANY NAMES HERE (or pass your own list as `companies`).
 * Order matters: it sets the counter number shown on hover (01 = first).
 */
export const defaultCompanies: Company[] = [
  { name: "Barclays", src: "/svg/barclays.svg" },
  { name: "Amazon Web Services", src: "/svg/aws.svg" },
  { name: "Drax", src: "/svg/drax.svg" },
  { name: "Google", src: "/svg/google.svg" },
  { name: "NHS", src: "/svg/nhs.svg" },
];

export function LogoSphere({
  companies = defaultCompanies,
  titleId = "experience",
}: {
  companies?: Company[];
  titleId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return createLogoSphere(ref.current);
  }, [companies]);

  const total = String(companies.length).padStart(2, "0");

  return (
    <div ref={ref} className="ls">
      <canvas data-ls-canvas aria-hidden className="ls__canvas" />

      <div className="ls__inner">
        <header data-ls-head className="ls__head wrap">
          <h3 id={titleId} className="ls__title section-title">
            <span data-ls-line className="ls__line">
              Experience
            </span>
            <span data-ls-line className="ls__line">
              with
            </span>
          </h3>
          <p className="ls__count" aria-live="polite">
            <span data-ls-count className="ls__count-now">
              {total}
            </span>{" "}
            / {total} companies
          </p>
        </header>

        <ul data-ls-row aria-labelledby={titleId} className="ls__row wrap">
          {companies.map((c) => (
            <li key={c.name} className="ls__item">
              {/* A plain <img> on purpose: scene.ts reads it to place each tile's start. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-ls-logo className="ls__logo" src={c.src} alt={c.name} decoding="async" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
