import type { CSSProperties } from "react";
import Image from "next/image";
import { PinnedWork } from "@/components/pinned-work";
import { PixelField } from "@/components/pixel-field";
import { ProcessGlobe } from "@/components/process-globe";
import { HERO_DISSOLVE } from "@/components/hero-events";
import { HashScroll } from "@/components/hash-scroll";
import { HeroHeadline } from "@/components/hero-headline";
import { LogoSphere } from "@/components/logo-sphere/logo-sphere";
import { ScrollFx } from "@/components/scroll-fx";
import { StackShowcase } from "@/components/stack-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PillLink } from "@/components/ui";
import {
  caseStudies,
  graphics,
  logos,
  notes,
  places,
  site,
  cloud,
  ink,
  stack,
} from "@/content";

function Hero() {
  return (
    // Tall section with a sticky panel: the hero stays pinned while scrolling
    // through it, and HeroHeadline scrubs the intro from that scroll.
    <section id="top" data-hero className="relative z-10 h-[220svh] bg-white">
      <div className="sticky top-0 flex h-svh min-h-[600px] items-center overflow-hidden">
        <div className="absolute inset-x-0 -top-40 bottom-0">
          <PixelField palette={cloud} mode="clouds" speed={0.012} seed={7} dissolveOn={HERO_DISSOLVE} className="size-full" />
        </div>
        <div className="wrap relative pt-10">
          <HeroHeadline />
          <p className="mx-auto mt-6 max-w-[680px] text-center text-lg leading-[1.45] sm:mt-8 sm:text-xl">{site.intro}</p>
        </div>
      </div>
    </section>
  );
}

function Momentum() {
  return (
    <section aria-labelledby="momentum" className="relative overflow-x-clip">
      <PixelField palette={ink} mode="fade-up" seed={41} className="h-[220px] w-full sm:h-[300px]" />
      <div className="bg-ink pb-16 text-white sm:pb-20">
        <ProcessGlobe places={places} />

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
      <PixelField palette={ink} mode="fade-down" seed={58} className="h-[220px] w-full sm:h-[300px]" />
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
    // The reel keeps its 16:9 shape, as large as fits the screen, so nothing
    // is cropped; any strip left over is the same #050505 as the reel's own
    // background, so it blends in rather than showing as a gap.
    <section id="reel" aria-label="Motion reel" className="relative h-[250svh] bg-[#050505] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[#050505] motion-reduce:static motion-reduce:h-auto">
        <iframe
          src="/reel/motion-reel.html"
          title="xanti studios motion reel"
          loading="lazy"
          className="block aspect-video w-[min(100%,calc(100svh*16/9))] border-0"
        />
      </div>
    </section>
  );
}

function Experience() {
  return (
    // "Experience with": company logos lift onto a scroll-driven 3D sphere.
    <section id="experience" className="bg-white pt-24 pb-10 sm:pt-28">
      <LogoSphere companies={logos} />
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className="bg-white pt-24 pb-24 sm:pt-28 sm:pb-32">
      <header className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-start">
        <h2 data-scroll className="fx-slide section-title">Field notes</h2>
        <div data-scroll data-lag={0.1} className="fx-rise">
          <p className="text-[17px] leading-[1.42] text-black/65">
            Writing on design, code, and what I learn building both.
          </p>
          <div className="mt-6">
            <PillLink href="#">More writing</PillLink>
          </div>
        </div>
      </header>

      <div className="no-scrollbar mt-14 overflow-x-auto sm:mt-20">
        <ul className="wrap flex gap-8 pb-8 sm:gap-14">
          {notes.map((n, i) => (
            <li
              key={n.title}
              data-scroll
              data-lag={i * 0.12}
              className="fx-drop shrink-0 pt-2"
              style={{ "--tilt": `${i % 2 ? 12 : -12}deg` } as CSSProperties}
            >
              <a
                href={n.href}
                className="stamp block w-[260px] sm:w-[300px]"
                style={{ rotate: `${[-1.5, 1, -0.8, 1.4][i % 4]}deg` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  {/* Comes into colour as the stamp drops into view (fx-colour). */}
                  <Image src={n.image} alt={n.alt} fill sizes="300px" className="fx-colour object-cover" />
                </div>
                <div className="perforation -mx-1 my-2" />
                <div className="flex items-end justify-between px-1 pb-1" style={{ color: n.color }}>
                  <div>
                    <p className="text-[10px] tabular-nums">{n.date}</p>
                    <p className="mt-0.5 max-w-[150px] font-serif text-[26px] leading-[0.9] italic">{n.title}</p>
                  </div>
                  <span className="text-4xl leading-none tabular-nums">{n.number}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
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
        <Writing />
      </main>
      <SiteFooter />
      <HashScroll />
      <ScrollFx />
    </>
  );
}
