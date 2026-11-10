// Content for the xanti studios portfolio, by @h4tfi3ld.

export const site = {
  name: "@h4tfi3ld",
  intro:
    "I'm @h4tfi3ld, a developer and designer. I build websites and web apps, design posters and social graphics, and keep levelling up through industry experiences with companies like Barclays, AWS and Drax.",
};

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Graphics", href: "/#graphics" },
  { label: "Industry", href: "/#industry" },
  { label: "CV", href: "/cv" },
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
// The "How I work" section and the motion reel share this darker black.
export const night = "#050505";
export const nightFade = ["#ffffff", "#8f8f8f", night];

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

// Tags on the pixel wheel. On the globe each one slides onto its country.
export const places = [
  { label: "United Kingdom", color: "#0a0a0a", x: "40%", y: "12%", lat: 54, lon: -2, side: "left" as const },
  { label: "United States", color: "#8f8f8f", x: "8%", y: "30%", lat: 39, lon: -98 },
  { label: "Germany", color: "#d0d0d0", x: "62%", y: "68%", lat: 51, lon: 10 },
];

// Lines that animate in and out while the globe is pinned. `from` and `to`
// are the share of the pinned scroll each line is on screen for (0 to 1).
export const globeLines = [
  { text: "International clients", from: 0.06, to: 0.29 },
  { text: "Things are getting bigger", from: 0.29, to: 0.52 },
  { text: "But we're still growing", from: 0.52, to: 0.75 },
  { text: "Let's build what's next", from: 0.75, to: 0.97 },
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

// Companies on the "Experience with" ring. `role` and `note` are shown in the
// middle while that company's card is at the front of the ring.
export const logos = [
  {
    name: "Barclays",
    src: "/svg/barclays.svg",
    role: "Software development",
    note: "Worked through real developer briefs, building and testing code with Barclays.",
  },
  {
    name: "Amazon Web Services",
    src: "/svg/aws.svg",
    role: "Cloud services",
    note: "Learned how the cloud runs modern apps on the AWS Career Tour: Cloud Computing.",
  },
  {
    name: "Drax",
    src: "/svg/drax.svg",
    role: "Cyber security",
    note: "Helped prevent a data breach in a cyber security sprint set by Drax.",
  },
  {
    name: "Google",
    src: "/svg/google.svg",
    role: "Data analytics",
    note: "Dug into data and turned it into clear insights with Google.",
  },
  {
    name: "NHS",
    src: "/svg/nhs.svg",
    role: "Graphic design",
    note: "Designed posters and social content as an NHS content creator.",
  },
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

// "Seen in the industry": photos from around the tech industry, in display
// order. Swap the photos in public/fieldnotes/ and edit the words here.
export const industry = [
  {
    title: "On the expo floor",
    tag: "Events",
    caption: "Product demos, interactive screens and teams showing off what they've built.",
    image: "/fieldnotes/note1.jpg",
    alt: "A busy tech expo hall lit by glowing screens and displays",
  },
  {
    title: "Inside the warehouse",
    tag: "Operations",
    caption: "Rows of kit being stocked, tested and shipped, and the systems that keep it all moving.",
    image: "/fieldnotes/note2.jpg",
    alt: "A warehouse floor stacked with boxes and production equipment",
  },
  {
    title: "Around the design table",
    tag: "Design",
    caption: "A product team working through samples, colours and materials before anything gets made.",
    image: "/fieldnotes/note3.jpg",
    alt: "A design team working around a table covered in trainers and samples",
  },
  {
    title: "In the control room",
    tag: "Monitoring",
    caption: "A wall of live dashboards, and the people watching them, keeping everything running.",
    image: "/fieldnotes/note4.jpg",
    alt: "Silhouetted people in front of a wall of screens in a dark control room",
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
    a: "Use the contact form on this page, or find me as @h4tfi3ld on Instagram, X and LinkedIn.",
  },
];

// CV page. Kept free of personal details and business or building addresses.
export const cv = {
  intro:
    "Test Technician Apprentice at Keysight Technologies with a strong academic foundation in Computer Science and electrical engineering. I bring hands-on technical assembly and systems testing experience, with a background in digital content creation, software and hardware development, and customer-focused roles.",
  industry: [
    {
      org: "Keysight Technologies",
      role: "Test Technician Apprentice",
      period: "09/2026 – present",
      points: [
        "An apprenticeship in a new industry and new technologies, after deciding to change my career path.",
        "Assembling and repairing machines and technologies to each customer's requirements and order, while learning the fundamentals of working in an engineering environment.",
      ],
    },
    {
      org: "NHS",
      role: "Content Creator",
      period: "03/2025 – 07/2026",
      points: [
        "My first real-world step into the computing industry, working in content creation.",
        "Worked on graphic design projects, interviews, photoshoots and maintaining social platforms, alongside a network of peers with unique skills that helped better our work.",
      ],
    },
  ],
  work: [
    {
      org: "Offshore Bar & Restaurant",
      role: "Waiter",
      period: "07/2023 – 09/2026",
      points: [
        "Working to industry standards in a professional workplace: how to interact with customers and give great service that represents the company well.",
      ],
    },
    {
      org: "Riccas Restaurant",
      role: "Waiter",
      period: "01/2025 – 07/2025",
      points: ["Furthered my social skills and hospitality experience working for a local company."],
    },
  ],
  education: [
    { org: "South Devon College", period: "2026 – 2032", detail: "Electrical Engineering & MS, Level 3/4 (in progress)" },
    { org: "South Devon UTC", period: "2024 – 2026", detail: "Computer Science Level 3: DDM / ABB / 128 UCAS points" },
    { org: "Newton Abbot College", period: "2019 – 2024", detail: "GCSE Computer Science" },
  ],
  skills: [
    { name: "Web development", level: 80 },
    { name: "Python", level: 65 },
    { name: "Git", level: 45 },
    { name: "Hardware & electronics", level: 35 },
    { name: "Testing & debugging", level: 25 },
    { name: "C#", level: 15 },
  ],
};

export const clocks = [{ city: "Devon, UK", zone: "Europe/London" }];
