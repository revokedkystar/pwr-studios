import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Loader } from "@/components/loader/loader";
import { InlineScript } from "@/components/inline-script";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";
import { siteUrl } from "@/content";

/*
 * On a refresh, always start at the very top of the page: stop the browser
 * restoring the old scroll position, drop any #section from the address so
 * it doesn't jump back there, and scroll to the top before the first paint
 * (and again once everything has loaded). For the first few seconds, until
 * the visitor scrolls themselves, any automatic scroll (the browser's own
 * jump to the old #section, or a library restoring its saved position) is
 * snapped back to the top. Normal visits, including shared links like
 * /#graphics, are left alone.
 */
const SCROLL_TO_TOP_ON_REFRESH = `(function(){try{
var nav=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];
var reload=nav?nav.type==="reload":(performance.navigation&&performance.navigation.type===1);
if(!reload)return;
if("scrollRestoration" in history)history.scrollRestoration="manual";
if(location.hash)history.replaceState(history.state,"",location.pathname+location.search);
var top=function(){window.scrollTo(0,0)};
top();
document.addEventListener("DOMContentLoaded",top);
window.addEventListener("load",function(){top();requestAnimationFrame(top)});
var until=performance.now()+3000,user=false;
["wheel","touchstart","keydown","pointerdown"].forEach(function(t){addEventListener(t,function(){user=true},{once:true,passive:true})});
addEventListener("scroll",function guard(){
if(user||performance.now()>until){removeEventListener("scroll",guard);return}
if(window.scrollY!==0)top();
},{passive:true});
}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Search results show about 50–60 characters of a title and 120–160 of a
// description. Both lead with what the studio does and where, the phrases
// people search for, and the headings and intro on the page repeat them.
const TITLE = "Web Designer & Developer in Devon, UK | xanti studios";
const DESCRIPTION =
  "xanti studios is @h4tfi3ld, a web designer and developer in Devon, UK, building fast websites, web apps and graphic design for brands and small businesses.";

// The site is designed light-only. "only light" stops browsers' forced dark
// modes (Brave's Night mode, Chrome's auto dark theme) from recolouring the
// text: they can't recolour the pixel art drawn on canvases, so the dark
// headline turned white on the white pixel sky.
// width=device-width, initial-scale=1 sizes the page to the phone's screen
// (Next.js adds these by default; they're spelt out here so nobody drops
// them). Zoom is left on: maximumScale/userScalable would block it, which
// fails accessibility audits.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "only light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  // Link previews (Discord, iMessage, WhatsApp, Slack, X…) read these.
  openGraph: {
    type: "website",
    siteName: "xanti studios",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <InlineScript html={SCROLL_TO_TOP_ON_REFRESH} />
      </head>
      <body className="min-h-full flex flex-col">
        <Loader />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
