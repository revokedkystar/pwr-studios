/**
 * Runs a small script synchronously while the HTML is parsed, before the
 * first paint (see the Next.js guide "Preventing flash before hydration").
 * On the server it's real JavaScript; on the client it's marked text/plain,
 * so React doesn't re-run it or warn about it.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
