// Content for the xanti studios portfolio, by @h4tfi3ld. The writing cards are still placeholders.

export const site = {
  name: "@h4tfi3ld",
  email: "hatfij08@gmail.com",
  intro:
    "I'm @h4tfi3ld, a developer and designer. I build websites and web apps, design posters and social graphics, and keep levelling up through industry experiences with companies like Barclays, AWS and Drax.",
};

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Graphics", href: "/#graphics" },
  { label: "Certificates", href: "/#certificates" },
  { label: "Writing", href: "/#writing" },
];

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/h4tfi3ld" },
  { label: "X", href: "https://x.com/h4tfi3ld" },
  { label: "GitHub", href: "https://github.com/revokedkystar" },
  { label: "Instagram", href: "https://www.instagram.com/h4tfi3ld" },
];

// Monochrome pixel palettes, from "empty" to "full".
export const cloud = ["#ffffff", "#dcdcdc", "#a3a3a3"];
export const ink = ["#ffffff", "#8f8f8f", "#0a0a0a"];

export const caseStudies = [
  {
    title: "OJR Trades FX: a transparent forex signals site built to convert",
    client: "OJR Trades FX, scalp trading signals",
    tags: ["Web design", "Finance", "Conversion"],
    href: "https://github.com/revokedkystar/ojrfx",
    image: "/websitepreview/ojrfx.webp",
    width: 1691,
    height: 973,
    alt: "OJR Trades FX homepage: 'Grow your capital alongside an active, transparent signals trader', with test account and trade evidence buttons",
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
    width: 1857,
    height: 919,
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
    width: 2172,
    height: 1230,
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

// Development stack, grouped for the sticky "Development stack" section.
export const stack = [
  {
    area: "Frontend",
    tools: [
      { name: "HTML", src: "/icons/html.svg" },
      { name: "CSS", src: "/icons/css.svg" },
      { name: "TypeScript", src: "/icons/typescript.svg" },
      { name: "React", src: "/icons/react.svg" },
      { name: "Tailwind CSS", src: "/icons/tailwind-svgrepo-com.svg" },
      { name: "Bootstrap", src: "/icons/bootstrap.svg" },
    ],
  },
  {
    area: "Backend & data",
    tools: [
      { name: "Python", src: "/icons/python.svg" },
      { name: "MySQL", src: "/icons/mysql.svg" },
      { name: "Git", src: "/icons/git.svg" },
    ],
  },
  {
    area: "Cloud & hosting",
    tools: [
      { name: "AWS", src: "/icons/amazon.svg" },
      { name: "Azure", src: "/icons/azure.svg" },
      { name: "Cloudflare", src: "/icons/cloudflare.svg" },
    ],
  },
];

// Field notes stamps, in display order. Swap the photos in public/fieldnotes/.
export const notes = [
  {
    date: "2026-11",
    title: "The quiet launch",
    number: "04",
    color: "#0a0a0a",
    image: "/fieldnotes/note1.jpg",
    alt: "A busy tech expo hall lit by glowing screens and displays",
    href: "#",
  },
  {
    date: "2026-10",
    title: "Nouns, then verbs",
    number: "03",
    color: "#5c5c5c",
    image: "/fieldnotes/note2.jpg",
    alt: "A warehouse floor stacked with boxes and production equipment",
    href: "#",
  },
  {
    date: "2026-09",
    title: "Why taste scales",
    number: "02",
    color: "#0a0a0a",
    image: "/fieldnotes/note3.jpg",
    alt: "A design team working around a table covered in trainers and samples",
    href: "#",
  },
  {
    date: "2026-08",
    title: "Small brands, big rooms",
    number: "01",
    color: "#7a7a7a",
    image: "/fieldnotes/note4.jpg",
    alt: "Silhouetted people in front of a wall of screens in a dark control room",
    href: "#",
  },
];

export const faqs = [
  {
    q: "Who are you?",
    a: "I'm @h4tfi3ld, a developer and designer who loves the point where computing meets creativity. This site is where I keep my best work.",
  },
  {
    q: "What do you build?",
    a: "Websites and web apps, like OJR Trades FX, Artisan Catering and Leisure Vehicle Auto Repairs, plus posters, campaigns and social graphics.",
  },
  {
    q: "What's in your stack?",
    a: "HTML, CSS, TypeScript and React with Tailwind or Bootstrap on the front end; Python, MySQL and Git behind it; and AWS, Azure and Cloudflare for hosting.",
  },
  {
    q: "What are you working on next?",
    a: "An ecommerce website of my own, alongside more design and development projects.",
  },
  {
    q: "How can I get in touch?",
    a: "Use the contact form on this page, email hatfij08@gmail.com, or find me as @h4tfi3ld on Instagram, X and LinkedIn.",
  },
];

export const clocks = [{ city: "Devon, UK", zone: "Europe/London" }];
