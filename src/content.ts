// Placeholder content for p*wr studios. Replace with real work, writing and links.

export const site = {
  name: "p*wr studios",
  email: "hello@example.com",
  bookCall: "mailto:hello@example.com?subject=Let%27s%20talk",
  intro:
    "We're p*wr, a small creative studio making bold brands, websites and launch campaigns, from the first sketch to the final ship, so your idea lands and your business grows.",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Graphics", href: "#graphics" },
  { label: "Certificates", href: "#certificates" },
  { label: "Writing", href: "#writing" },
];

export const socials = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Instagram", href: "#" },
];

// Monochrome pixel palettes, from "empty" to "full".
export const cloud = ["#ffffff", "#dcdcdc", "#a3a3a3"];
export const ink = ["#ffffff", "#8f8f8f", "#0a0a0a"];

export const caseStudies = [
  {
    title: "Unit Pal: tracking a BTEC Level 3 IT diploma, unit by unit",
    client: "Web app, grade tracking and data visualisation",
    tags: ["Web app", "Data visualisation", "Education"],
    href: "https://github.com/revokedkystar/unit-pal-progress",
    image: "/websitepreview/preview1.png",
    alt: "Unit Pal dashboard showing diploma progress, a grade chart and a unit inventory",
    palette: cloud,
    seed: 11,
    dark: false,
  },
  {
    title: "Artisan Catering: a website for a Devon catering company",
    client: "Artisan Catering, Devon",
    tags: ["Web design", "Hospitality", "Gallery"],
    href: "https://github.com/revokedkystar/artisan-web",
    image: "/websitepreview/preview2.png",
    alt: "Artisan Catering homepage with a candlelit banquet hall image slider",
    palette: ["#ffffff", "#c9c9c9", "#6b6b6b"],
    seed: 31,
    dark: false,
  },
  {
    title: "Leisure Vehicle Auto Repairs: garage and vehicle repairs in Newton Abbot",
    client: "Leisure Vehicle Auto Repairs, Newton Abbot",
    tags: ["Web design", "Local business", "Lead generation"],
    href: "https://github.com/revokedkystar/lvar",
    image: "/websitepreview/preview3.png",
    alt: "Dark garage website hero reading 'Garage and vehicle repairs in Newton Abbot'",
    palette: ["#0a0a0a", "#1c1c1c", "#3a3a3a"],
    seed: 23,
    dark: true,
  },
];

export const process = [
  { label: "Strategy", color: "#0a0a0a", x: "18%", y: "30%" },
  { label: "Design", color: "#8f8f8f", x: "62%", y: "14%" },
  { label: "Build", color: "#d0d0d0", x: "68%", y: "66%" },
];

// Poster and social graphics, scattered around the "Graphic design" heading.
// w/h are the card size on wide screens; x/y place it inside the section.
export const graphics = [
  { src: "/graphics/gd0.png", alt: "Fresh Denim Arrivals fashion poster", w: 150, h: 188, x: "2%", y: "8%", r: -3 },
  { src: "/graphics/gd1.png", alt: "KOVA 'Your Move' basketball campaign poster", w: 176, h: 218, x: "15%", y: "0%", r: 2 },
  { src: "/graphics/gd4.png", alt: "'Art is my love language' sticker collage poster", w: 132, h: 235, x: "9%", y: "40%", r: 1 },
  { src: "/graphics/gd2.png", alt: "'Odd One Out' outdoor clothing poster", w: 170, h: 212, x: "13%", y: "72%", r: 3 },
  { src: "/graphics/gd7.png", alt: "Project 7even banner: Computing meets Creativity", w: 260, h: 86, x: "37%", y: "88%", r: -2 },
  { src: "/graphics/gd8.png", alt: "'Coming Soon' streetwear launch poster", w: 132, h: 235, x: "67%", y: "66%", r: 2 },
  { src: "/graphics/gd3.png", alt: "'Street Revolution' magazine cover", w: 160, h: 200, x: "72%", y: "0%", r: -2 },
  { src: "/graphics/gd5.png", alt: "Prada Milano stamp-style poster", w: 120, h: 213, x: "77%", y: "36%", r: 0 },
  { src: "/graphics/gd6.png", alt: "NHS Torbay volunteer content creator recruitment poster", w: 125, h: 222, x: "89%", y: "14%", r: 3 },
  { src: "/graphics/gd9.png", alt: "'Broken Planet' streetwear drop poster", w: 128, h: 228, x: "87%", y: "62%", r: -3 },
];

export const certificates = [
  {
    title: "Data Analytics",
    partner: "Barclays",
    image: "/certificates/analytics_award.jpg",
  },
  {
    title: "Developer",
    partner: "Barclays",
    image: "/certificates/dev_award.png",
  },
  {
    title: "AWS Career Tour: Cloud Computing",
    partner: "Amazon Web Services",
    image: "/certificates/cloud_award.png",
  },
  {
    title: "Prevent a Data Breach: Cyber Security Sprint",
    partner: "Drax",
    image: "/certificates/drax_award.png",
  },
];

export const certificateMeta = { issuer: "Springpod", issued: "02/04/2026" };

export const logos = [
  { name: "Barclays", src: "/svg/barclays.svg" },
  { name: "Amazon Web Services", src: "/svg/aws.svg" },
  { name: "Drax", src: "/svg/drax.svg" },
  { name: "Google", src: "/svg/google.svg" },
  { name: "NHS", src: "/svg/nhs.svg" },
];

export const toolkit = [
  { name: "HTML", src: "/icons/html.svg" },
  { name: "CSS", src: "/icons/css.svg" },
  { name: "TypeScript", src: "/icons/typescript.svg" },
  { name: "React", src: "/icons/react.svg" },
  { name: "Tailwind CSS", src: "/icons/tailwind-svgrepo-com.svg" },
  { name: "Bootstrap", src: "/icons/bootstrap.svg" },
  { name: "Python", src: "/icons/python.svg" },
  { name: "MySQL", src: "/icons/mysql.svg" },
  { name: "Git", src: "/icons/git.svg" },
  { name: "AWS", src: "/icons/amazon.svg" },
  { name: "Azure", src: "/icons/azure.svg" },
  { name: "Cloudflare", src: "/icons/cloudflare.svg" },
];

export const notes = [
  { date: "2026-11", title: "The quiet launch", number: "04", color: "#0a0a0a", palette: ["#f7f7f7", "#c8c8c8", "#0a0a0a"], href: "#" },
  { date: "2026-10", title: "Nouns, then verbs", number: "03", color: "#5c5c5c", palette: ["#f7f7f7", "#dddddd", "#5c5c5c"], href: "#" },
  { date: "2026-09", title: "Why taste scales", number: "02", color: "#0a0a0a", palette: ["#f7f7f7", "#9a9a9a", "#2a2a2a"], href: "#" },
  { date: "2026-08", title: "Small brands, big rooms", number: "01", color: "#7a7a7a", palette: ["#f7f7f7", "#e6e6e6", "#8a8a8a"], href: "#" },
];

export const faqs = [
  {
    q: "What does p*wr studios do?",
    a: "Brand identities, websites and launch campaigns for founders and teams who want to look as good as their product is. Strategy, design and build under one roof.",
  },
  {
    q: "Who do you work with?",
    a: "Mostly early-stage startups and independent businesses, plus the odd established brand that wants a fresh pair of eyes.",
  },
  {
    q: "How long does a project take?",
    a: "A focused identity or landing page usually takes three to six weeks. Larger sites and campaigns are planned in phases so you can ship early.",
  },
  {
    q: "Where are you based?",
    a: "We work remotely across a few time zones, and travel for kick-offs and workshops when it helps.",
  },
  {
    q: "How can I get in touch?",
    a: "Book a call from the bar at the top, or email hello@example.com. Tell us what you're building and when you'd like to launch.",
  },
];

export const clocks = [
  { city: "London, UK", zone: "Europe/London" },
  { city: "New York, US", zone: "America/New_York" },
  { city: "Tokyo, JP", zone: "Asia/Tokyo" },
];
