import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Loader } from "@/components/loader/loader";
import { InlineScript } from "@/components/inline-script";
import "./globals.css";

/*
 * On a refresh, always start at the very top of the page: stop the browser
 * restoring the old scroll position, drop any #section from the address so
 * it doesn't jump back there, and scroll to the top before the first paint
 * (and again once everything has loaded). Normal visits, including shared
 * links like /#contact, are left alone.
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

export const metadata: Metadata = {
  title: "Joshua Hatfield, developer and designer",
  description: "The portfolio of Joshua Hatfield: websites, web apps, graphic design and certificates.",
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
        {children}
      </body>
    </html>
  );
}
