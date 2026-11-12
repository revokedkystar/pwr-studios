import type { Metadata } from "next";
import Image from "next/image";
import { ContactSection } from "@/components/contact-section";
import { ExperienceRing } from "@/components/experience-ring";
import { HashScroll } from "@/components/hash-scroll";
import { PixelField } from "@/components/pixel-field";
import { ScrollFx } from "@/components/scroll-fx";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { StackShowcase } from "@/components/stack-showcase";
import { Tag } from "@/components/ui";
import { certificateMeta, certificates, logos, nightFade, stack } from "@/content";

const TITLE = "Experience, Tech Stack & Certificates | xanti studios";
const DESCRIPTION =
  "The tech stack, companies and certificates behind xanti studios, a web designer and developer in Devon, UK, with industry experience at Barclays, AWS and Drax.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/experience" },
  // A page's openGraph replaces the layout's, so the shared fields are repeated.
  openGraph: { type: "website", siteName: "xanti studios", title: TITLE, description: DESCRIPTION, url: "/experience" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

/*
 * Experience page: 1. the development stack, 2. the companies worked with,
 * 3. certificates and awards.
 */

function Intro() {
  return (
    <section aria-labelledby="experience-page" className="bg-white pt-36 sm:pt-44">
      <div className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-end">
        <h1 id="experience-page" data-scroll className="fx-slide section-title">
          Experience
        </h1>
        <p data-scroll data-lag={0.1} className="fx-rise text-[17px] leading-[1.42] text-black/65">
          The tools I build with, the companies I&apos;ve worked with and alongside, and the certificates I&apos;ve
          picked up on the way.
        </p>
      </div>
    </section>
  );
}

function Stack() {
  return (
    // 1. Tech stack: the tools fly into a spinning ring on a black band.
    <section aria-labelledby="stack" className="relative overflow-x-clip">
      <PixelField palette={nightFade} mode="fade-up" seed={41} className="mt-16 h-[220px] w-full sm:mt-24 sm:h-[300px]" />
      <div className="bg-[#050505] text-white">
        <StackShowcase areas={stack} />
      </div>
      <PixelField palette={nightFade} mode="fade-down" seed={58} className="h-[220px] w-full sm:h-[300px]" />
    </section>
  );
}

function Companies() {
  return (
    // 2. Companies: cards on a 3D ring that spins on its own.
    <section id="experience" aria-labelledby="experience-title" className="bg-white">
      <ExperienceRing companies={logos} titleId="experience-title" />
    </section>
  );
}

function Certificates() {
  return (
    // 3. Certificates and awards.
    <section id="certificates" aria-labelledby="certificates-title" className="bg-white pt-24 pb-16 sm:pt-28">
      <header className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-end">
        <h2 id="certificates-title" data-scroll className="fx-slide section-title">
          Certificates
          <br />
          and awards
        </h2>
        <p data-scroll data-lag={0.1} className="fx-rise text-[17px] leading-[1.42] text-black/65">
          Industry experiences I&apos;ve completed with {certificateMeta.issuer}, working through real briefs set by
          Barclays, Amazon Web Services and Drax. Tap one to see it full size.
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
    </section>
  );
}

export default function ExperiencePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Intro />
        <Stack />
        <Companies />
        <Certificates />
        <ContactSection />
      </main>
      <SiteFooter />
      <HashScroll />
      <ScrollFx />
      <SmoothScroll />
    </>
  );
}
