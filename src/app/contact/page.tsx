import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PixelField } from "@/components/pixel-field";
import { ScrollFx } from "@/components/scroll-fx";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArrowIcon } from "@/components/ui";
import { faqs, ink, site, socials } from "@/content";

export const metadata: Metadata = {
  title: "Contact · xanti studios by @h4tfi3ld",
  description: "Get in touch with @h4tfi3ld: send a message, or find quick answers to common questions.",
  // A page's openGraph replaces the layout's, so the shared fields are repeated.
  openGraph: {
    type: "website",
    siteName: "xanti studios",
    title: "Contact · xanti studios by @h4tfi3ld",
    description: "Get in touch with @h4tfi3ld: send a message, or find quick answers to common questions.",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact · xanti studios by @h4tfi3ld",
    description: "Get in touch with @h4tfi3ld: send a message, or find quick answers to common questions.",
  },
};

function Contact() {
  return (
    <section aria-labelledby="contact-title" className="bg-white pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-4">
        <div>
          <h1 id="contact-title" data-scroll className="fx-slide section-title">
            Get in touch
          </h1>
          <p data-scroll data-lag={0.1} className="fx-rise mt-6 max-w-[380px] text-[17px] leading-[1.42] text-black/62">
            Got a project, an opportunity or just a question? Send me a message and it&apos;ll land straight in my
            inbox.
          </p>
          <dl data-scroll data-lag={0.2} className="fx-rise mt-10 grid max-w-[380px] gap-5 text-base">
            <div>
              <dt className="text-sm text-black/45">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-black/45">Elsewhere</dt>
              <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} className="underline-offset-4 hover:underline">
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <div data-scroll data-lag={0.15} className="fx-rise">
          <ContactForm email={site.email} />
        </div>
      </div>
    </section>
  );
}

function SmallTalk() {
  return (
    <section id="faq" aria-labelledby="small-talk" className="bg-white pt-8 pb-24 sm:pb-36">
      <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-4">
        <div>
          <h2 id="small-talk" data-scroll className="fx-slide section-title">
            Small talk
          </h2>
          <p className="mt-6 max-w-[352px] text-[17px] leading-[1.42] text-black/62">
            The quick answers are here. For anything else, just ask.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((f, i) => (
            <details key={f.q} data-scroll data-lag={i * 0.08} className="fx-rise group rounded-2xl bg-surface">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-5 text-[17px]">
                {f.q}
                <svg viewBox="0 0 16 16" className="faq-plus size-4 shrink-0 text-black/50 transition-[rotate] duration-300" aria-hidden>
                  <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm leading-normal text-black/62">{f.a}</p>
            </details>
          ))}
          <a
            href={`mailto:${site.email}`}
            data-scroll
            data-lag={0.4}
            className="fx-rise group flex items-center gap-3 rounded-2xl bg-surface py-3 pr-3 pl-5 text-[17px] text-black/35 transition-colors hover:text-black/60"
          >
            <span className="size-7 overflow-hidden rounded-sm">
              <PixelField palette={ink} cell={4} dither={1} scale={0.4} seed={9} className="size-full" />
            </span>
            <span className="flex-1">Ask me anything else</span>
            <span className="grid size-8 place-items-center rounded-full bg-black/15 text-white transition-colors group-hover:bg-black">
              <ArrowIcon className="size-3.5 -rotate-45" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Contact />
        <SmallTalk />
      </main>
      <SiteFooter />
      <ScrollFx />
    </>
  );
}
