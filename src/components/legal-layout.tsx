import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LEGAL_UPDATED, legalLinks } from "@/legal";

/** Shared frame for the policy pages: title, date, body, and links to the others. */
export function LegalLayout({ title, intro, current, children }: { title: string; intro: string; current: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white pt-36 pb-24 sm:pt-44 sm:pb-32">
        <article className="wrap grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div className="max-w-[720px]">
            <h1 className="section-title">{title}</h1>
            <p className="mt-4 text-sm text-black/60">Last updated {LEGAL_UPDATED}</p>
            <p className="mt-8 text-lg leading-[1.45] text-black/80 sm:text-xl">{intro}</p>
            <div className="mt-12 flex flex-col gap-10">{children}</div>
          </div>
          <nav aria-label="Policies" className="h-fit lg:sticky lg:top-28">
            <p className="text-sm text-black/60">Policies</p>
            <ul className="mt-2 flex flex-col">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={l.href === current ? "page" : undefined}
                    className="tap-target text-[15px] text-black/70 hover:text-black aria-[current=page]:font-medium aria-[current=page]:text-black"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
