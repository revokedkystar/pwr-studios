import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactSection } from "@/components/contact-section";
import { HashScroll } from "@/components/hash-scroll";
import { IndustryGallery } from "@/components/industry-gallery";
import { ScrollFx } from "@/components/scroll-fx";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { PillLink } from "@/components/ui";
import { graphics, industry } from "@/content";

const TITLE = "Graphic Design Portfolio, Devon, UK | xanti studios";
const DESCRIPTION =
  "Posters, campaigns, branding and social graphics by xanti studios, a web and graphic designer in Devon, UK, plus photos from around the tech industry.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/graphics" },
  // A page's openGraph replaces the layout's, so the shared fields are repeated.
  openGraph: { type: "website", siteName: "xanti studios", title: TITLE, description: DESCRIPTION, url: "/graphics" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

/*
 * Graphics page: the graphic design wall and "Seen in the industry",
 * moved off the homepage to keep it shorter.
 */

function Graphics() {
  return (
    <section id="graphics" aria-labelledby="graphics-title" className="relative overflow-hidden bg-white pt-32 pb-24 lg:pt-16 lg:pb-0">
      <div className="wrap relative lg:h-[860px]">
        <div className="relative z-10 mx-auto max-w-[480px] text-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <h1 id="graphics-title" data-scroll className="fx-rise fx-scale section-title">
            Graphic
            <br />
            design
          </h1>
          <p data-scroll data-lag={0.1} className="fx-rise mx-auto mt-6 max-w-[380px] text-[17px] leading-[1.42] text-black/65">
            Posters, campaigns and social graphics I&apos;ve designed for fashion, sport and community projects. Scroll
            to bring them into colour.
          </p>
          <div className="mt-7">
            <PillLink href="/contact">Say hello</PillLink>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-0 lg:block">
          {graphics.map((g, i) => (
            <li
              key={g.src}
              data-scroll
              data-lag={(i % 3) * 0.12}
              className={`${g.w > g.h ? "col-span-2 aspect-[3/1]" : "aspect-[4/5]"} fx-rise fx-parallax-lg group relative overflow-hidden rounded-[22px] bg-surface lg:absolute lg:top-(--y) lg:left-(--x) lg:aspect-auto lg:h-(--h) lg:w-(--w) lg:rotate-(--r) lg:hover:z-20`}
              style={
                {
                  "--x": g.x,
                  "--y": g.y,
                  "--w": `${g.w}px`,
                  "--h": `${g.h}px`,
                  "--r": `${g.r}deg`,
                  "--speed": `${[-260, 180, -120, 240, -200, 140][i % 6]}px`,
                } as CSSProperties
              }
            >
              <a href={g.src} target="_blank" rel="noreferrer" className="block size-full">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="fx-colour object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Industry() {
  return (
    <section id="industry" className="bg-white pt-24 pb-24 sm:pt-28 sm:pb-32">
      <header className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-end">
        <h2 data-scroll className="fx-slide section-title">
          Seen in the
          <br />
          industry
        </h2>
        <p data-scroll data-lag={0.1} className="fx-rise text-[17px] leading-[1.42] text-black/65">
          Places I&apos;ve been and things I&apos;ve seen around the tech industry: expos, warehouses, design studios
          and control rooms. Tap a photo to see it bigger.
        </p>
      </header>

      <IndustryGallery items={industry} />
    </section>
  );
}

export default function GraphicsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Graphics />
        <Industry />
        <ContactSection />
      </main>
      <SiteFooter />
      <HashScroll />
      <ScrollFx />
      <SmoothScroll />
    </>
  );
}
