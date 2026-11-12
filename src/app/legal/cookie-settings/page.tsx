import type { Metadata } from "next";
import { CookieSettings } from "@/components/cookie-settings";
import { LegalLayout } from "@/components/legal-layout";

const TITLE = "Cookie settings | xanti studios";
const DESCRIPTION = "See and clear what xanti.dev stores in your browser. The site sets no cookies and no trackers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/legal/cookie-settings" },
  robots: { index: false },
  openGraph: { type: "website", siteName: "xanti studios", title: TITLE, description: DESCRIPTION, url: "/legal/cookie-settings" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function CookieSettingsPage() {
  return (
    <LegalLayout
      title="Cookie settings"
      intro="xanti.dev doesn't use cookies or trackers, so there's nothing to switch off. Here's everything the site can store in your browser, and a button to clear it."
      current="/legal/cookie-settings"
    >
      <CookieSettings />
    </LegalLayout>
  );
}
