"use client";

/*
 * "Experience with" section with a scroll-driven 3D logo sphere.
 *
 *   HTML structure → this file
 *   CSS            → ./logo-sphere.css (colour, font and sphere-size variables)
 *   JS             → ./scene.ts (Three.js + GSAP ScrollTrigger + Lenis)
 *
 * The section starts as a headline, a counter and a row of logos (each with
 * its role underneath). Scrolling pins it and lifts the logos onto a spinning
 * sphere, then features each company in turn with a short note on what was
 * done there; see scene.ts.
 */
import { useEffect, useRef } from "react";
import { createLogoSphere } from "./scene";
import "lenis/dist/lenis.css";
import "./logo-sphere.css";

export type Company = {
  /** Company name: used for the logo's alt text. */
  name: string;
  /** Logo file, ideally an SVG or PNG with a transparent background. */
  src: string;
  /** Short label for the work done there, e.g. "Cyber security". */
  role?: string;
  /** One sentence on what was done there, shown while the company is featured. */
  note?: string;
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
              {c.role && (
                <p className="ls__role">
                  {c.role}
                  {c.note && <span className="sr-only">: {c.note}</span>}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* The featured company's note, swapped by scene.ts as the sphere is scrolled. */}
      <div aria-hidden className="ls__notes wrap">
        {companies.map((c, i) =>
          c.note ? (
            <div key={c.name} data-ls-note={i} className="ls__note">
              <p className="ls__note-eyebrow">
                {String(i + 1).padStart(2, "0")} · {c.name}
              </p>
              {c.role && <p className="ls__note-role">{c.role}</p>}
              <p className="ls__note-text">{c.note}</p>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
