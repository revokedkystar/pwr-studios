import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { PinnedWork } from "@/components/pinned-work";
import { PixelField } from "@/components/pixel-field";
import { ProcessGlobe } from "@/components/process-globe";
import { HERO_DISSOLVE } from "@/components/hero-events";
import { HashScroll } from "@/components/hash-scroll";
import { HeroHeadline } from "@/components/hero-headline";
import { IndustryGallery } from "@/components/industry-gallery";
import { ContactSection } from "@/components/contact-section";
import { JsonLd } from "@/components/json-ld";
import { ExperienceRing } from "@/components/experience-ring";
import { ScrollFx } from "@/components/scroll-fx";
import { ScrollPrompt } from "@/components/scroll-prompt";
import { SmoothScroll } from "@/components/smooth-scroll";
import { StackShowcase } from "@/components/stack-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PillLink } from "@/components/ui";
import {
  caseStudies,
  graphics,
  logos,
  industry,
  places,
  globeLines,
  site,
  cloud,
  nightFade,
  stack,
} from "@/content";
import { homeJsonLd } from "@/structured-data";

// <link rel="canonical" href="https://xanti.dev/">, resolved against the
// layout's metadataBase. Each page sets its own: a canonical in the layout
// would be inherited by every page and point them all at the homepage.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function Hero() {
  return (
    // Tall section with a sticky panel: the hero stays pinned while scrolling
    // through it, and HeroHeadline scrubs the intro from that scroll.
    <section id="top" data-hero className="relative z-10 h-[220svh] bg-white">
      <div className="sticky top-0 flex h-svh min-h-[600px] flex-col justify-center overflow-hidden">
        <div className="absolute inset-x-0 -top-40 bottom-0">
          <PixelField palette={cloud} mode="clouds" speed={0.012} seed={7} dissolveOn={HERO_DISSOLVE} className="size-full" />
        </div>
        <div className="wrap relative pt-10">
          <HeroHeadline />
          <p className="mx-auto mt-6 max-w-[680px] text-center text-lg leading-[1.45] sm:mt-8 sm:text-xl">{site.intro}</p>
          <div className="mt-6 flex justify-center sm:mt-9">
            <PillLink href="/contact">Build your site</PillLink>
          </div>
        </div>
        <ScrollPrompt />
      </div>
    </section>
  );
}

function Momentum() {
  return (
    <section aria-labelledby="momentum" className="relative overflow-x-clip">
      <PixelField palette={nightFade} mode="fade-up" seed={41} className="h-[220px] w-full sm:h-[300px]" />
      <div className="bg-[#050505] pb-16 text-white sm:pb-20">
        <ProcessGlobe places={places} lines={globeLines} />

        <div className="wrap mt-16 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-4">
          <h2 id="momentum" data-scroll className="fx-slide text-[44px] leading-none font-medium tracking-[-0.01em] sm:text-6xl">
            How I work
          </h2>
          <div data-scroll data-lag={0.15} className="fx-rise max-w-[480px]">
            <p className="text-lg leading-[1.3] sm:text-xl">
              I like taking an idea from the first sketch to something real: planning it out, designing how it should
              look and feel, then building it in code. Here&apos;s the stack I use to get there.
            </p>
            <div className="mt-7">
              <PillLink href="#stack" invert>
                See my stack
              </PillLink>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <Reel />
        </div>

        <div className="mt-16 sm:mt-24">
          <StackShowcase areas={stack} />
        </div>
      </div>
      <PixelField palette={nightFade} mode="fade-down" seed={58} className="h-[220px] w-full sm:h-[300px]" />
    </section>
  );
}

function Graphics() {
  return (
    <section id="graphics" className="relative overflow-hidden bg-white py-24 lg:py-0">
      <div className="wrap relative lg:h-[860px]">
        <div className="relative z-10 mx-auto max-w-[480px] text-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <h2 data-scroll className="fx-rise fx-scale section-title">
            Graphic
            <br />
            design
          </h2>
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

function Reel() {
  return (
    // The motion reel (public/reel/motion-reel.html), locked to the screen
    // while it scrolls past: the tall outer box keeps the sticky panel pinned
    // for a screen and a half of scrolling before the page moves on.
    // The frame fills the screen. Inside it the reel keeps its 16:9 shape, as
    // large as fits, so nothing is cropped; the space around it gets the same
    // grained black as the reel (about #050505 on average), so the two blend.
    <section id="reel" aria-label="Motion reel" className="relative h-[250svh] bg-[#050505] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[#050505] motion-reduce:static motion-reduce:h-auto">
        <iframe
          src="/reel/motion-reel.html"
          title="xanti studios motion reel"
          loading="lazy"
          className="block size-full border-0"
        />
      </div>
    </section>
  );
}

function Experience() {
  return (
    // "Experience with": company cards on a 3D ring that spins on its own.
    <section id="experience" aria-labelledby="experience-title" className="bg-white">
      <ExperienceRing companies={logos} titleId="experience-title" />
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <PinnedWork items={caseStudies} />
        <Momentum />
        <Graphics />
        <Experience />
        <Industry />
        <ContactSection />
      </main>
      <JsonLd data={homeJsonLd} />
      <SiteFooter />
      <HashScroll />
      <ScrollFx />
      <SmoothScroll />
    </>
  );
}
