import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/legal-layout";
import { legalPages, type LegalBlock } from "@/legal";

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => legalPages.find((p) => p.slug === slug);

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const page = find((await params).slug);
  if (!page) return {};
  const title = `${page.title} | xanti studios`;
  const url = `/legal/${page.slug}`;
  return {
    title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "xanti studios", title, description: page.description, url },
    twitter: { card: "summary", title, description: page.description },
  };
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-black/30">
      {block.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function LegalPageRoute({ params }: PageProps<"/legal/[slug]">) {
  const page = find((await params).slug);
  // Only the pages in legalPages exist; anything else is a 404.
  if (!page) notFound();
  return (
    <LegalLayout title={page.title} intro={page.intro} current={`/legal/${page.slug}`}>
      {page.sections.map((s) => (
        <section key={s.heading}>
          <h2 className="text-2xl font-medium tracking-[-0.01em] sm:text-[28px]">{s.heading}</h2>
          <div className="mt-4 flex flex-col gap-4 text-[17px] leading-[1.55] text-black/75">
            {s.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
        </section>
      ))}
    </LegalLayout>
  );
}
