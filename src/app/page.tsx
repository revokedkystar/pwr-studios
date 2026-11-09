import type { CSSProperties } from "react";
import Image from "next/image";
import { PinnedWork } from "@/components/pinned-work";
import { PixelField } from "@/components/pixel-field";
import { HERO_DISSOLVE } from "@/components/hero-events";
import { HashScroll } from "@/components/hash-scroll";
import { HeroHeadline } from "@/components/hero-headline";
import { LogoSphere } from "@/components/logo-sphere/logo-sphere";
import { ScrollFx } from "@/components/scroll-fx";
import { StackShowcase } from "@/components/stack-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PillLink, Tag } from "@/components/ui";
import {
  caseStudies,
  certificateMeta,
  certificates,
  graphics,
  logos,
  notes,
  process,
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
      <div className="bg-ink pt-10 pb-16 text-white sm:pb-20">
        <div data-scroll className="fx-grow relative mx-auto aspect-square w-[min(520px,82vw)]">
          <div className="fx-spin absolute inset-0 overflow-hidden rounded-full [--turn:140deg]">
            <PixelField
              palette={["#0a0a0a", "#4a4a4a", "#d4d4d4"]}
              cell={14}
              scale={0.13}
              seed={5}
              speed={0.01}
              className="size-full"
            />
          </div>
          <Image
            src="/websiteicon.png"
            alt=""
            width={156}
            height={154}
            className="absolute top-1/2 left-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2 fx-spin [--turn:-360deg] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
          />
          {process.map((p, i) => (
            <span
              key={p.label}
              data-scroll
              data-lag={0.2 + i * 0.15}
              className="fx-rise absolute flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-sm whitespace-nowrap text-black shadow-sm"
              style={{ left: p.x, top: p.y }}
            >
              <span className="size-3 rounded-sm" style={{ background: p.color }} />
              {p.label}
            </span>
          ))}
        </div>

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

function Certificates() {
  return (
    <section id="certificates" className="bg-white pt-24 pb-10 sm:pt-28">
      <header className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-start">
        <h2 data-scroll className="fx-slide section-title">Certificates</h2>
        <p data-scroll data-lag={0.1} className="fx-rise text-[17px] leading-[1.42] text-black/65">
          Industry experiences I&apos;ve completed with {certificateMeta.issuer}, working through real briefs set by
          Barclays, Amazon Web Services and Drax.
        </p>
      </header>

      <ul className="wrap mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
        {certificates.map((c, i) => (
          <li key={c.image} data-scroll data-lag={i * 0.1} className="fx-rise">
            <a href={c.image} target="_blank" rel="noreferrer" className="group block">
              <div className="relative aspect-[3508/2483] overflow-hidden rounded-[20px] bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                <Image
                  src={c.image}
                  alt={`${certificateMeta.issuer} certificate: ${c.title} with ${c.partner}`}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 92vw"
                  className="fx-colour object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Tag>{c.partner}</Tag>
                <Tag>{certificateMeta.issuer}</Tag>
              </div>
              <h3 className="mt-2 text-lg leading-snug font-medium">{c.title}</h3>
              <p className="mt-1 text-sm text-black/50">Issued {certificateMeta.issued}</p>
            </a>
          </li>
        ))}
      </ul>

      {/* "Experience with": company logos lift onto a scroll-driven 3D sphere. */}
      <div className="mt-10 sm:mt-16">
        <LogoSphere companies={logos} />
      </div>
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
                <div className="aspect-square overflow-hidden">
                  <PixelField palette={n.palette} seed={100 + i * 13} cell={12} dither={1.5} scale={0.14} className="size-full" />
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
        <Certificates />
        <Writing />
      </main>
      <SiteFooter />
      <HashScroll />
      <ScrollFx />
    </>
  );
}
