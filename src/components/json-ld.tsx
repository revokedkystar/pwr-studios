/**
 * Structured data (schema.org JSON-LD) for search engines and AI. Rendered as
 * a plain <script type="application/ld+json">, as the Next.js JSON-LD guide
 * recommends: it's data, not code, so next/script isn't needed. `<` is
 * escaped so no string in the data can close the tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
