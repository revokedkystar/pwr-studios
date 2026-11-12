// Policy pages linked from the footer, rendered by app/legal/[slug]/page.tsx.
// Cookie settings is interactive and lives in app/legal/cookie-settings.
//
// Each section's body is a list of blocks: a string is a paragraph, an array
// of strings is a bulleted list. Keep these in step with what the site
// actually does: today it sets no cookies, runs no analytics, and sends the
// contact form through Web3Forms.

export type LegalBlock = string | string[];
export type LegalSection = { heading: string; body: LegalBlock[] };
export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

export const LEGAL_UPDATED = "12 November 2026";

const WHO =
  "xanti studios (\"we\", \"us\", \"our\") is a web design, development and graphic design studio based in Devon, UK, run by @h4tfi3ld. You can reach us at any time through the contact form at xanti.dev/contact.";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How xanti studios collects, uses and protects personal information, and your rights under UK data protection law.",
    intro:
      "This policy explains what personal information we collect when you use xanti.dev or work with us, why we collect it, and the rights you have over it under the UK GDPR and the Data Protection Act 2018.",
    sections: [
      { heading: "Who we are", body: [WHO, "For the personal information described here, we are the data controller."] },
      {
        heading: "What we collect",
        body: [
          [
            "Contact form messages: your name, email address and message, when you send them to us.",
            "Emails and other messages you send us, and our replies.",
            "Project information, if you become a client: contact details, the content you give us for your website, quotes, invoices and payment records.",
            "Technical information: our hosting provider processes your IP address, browser type and the pages you request, so the site can be delivered and protected from abuse.",
          ],
          "We don't run analytics or advertising trackers, and the site sets no cookies. See the Cookie Policy and Site statistics pages for details.",
        ],
      },
      {
        heading: "Why we use it",
        body: [
          [
            "To reply to your enquiry and talk about your project (our legitimate interest in responding to people who contact us).",
            "To quote for, deliver and support the work you ask us to do (to perform our contract with you).",
            "To keep business and tax records (to meet our legal obligations).",
            "To keep the website secure and working (our legitimate interest in running a safe website).",
          ],
          "We never sell your information, and we don't use it for marketing unless you've asked us to.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "We only share information with the services we need to run the studio, and only what they need:",
          [
            "Web3Forms, which delivers contact form messages to our inbox.",
            "Our email provider, which stores our emails.",
            "Our website hosting provider, which serves the site and keeps short-term server logs.",
            "Accounting and payment services, for client invoices and payments.",
          ],
          "Some of these providers may process information outside the UK. Where they do, we rely on safeguards recognised under UK law, such as adequacy regulations or standard contractual clauses.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          [
            "Enquiries that don't lead to work: up to 12 months, then deleted.",
            "Client project and financial records: for as long as UK tax law requires, normally six years after the end of the tax year they relate to.",
            "Server logs held by our hosting provider: for the short period the provider keeps them for security.",
          ],
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Under UK data protection law you have the right to:",
          [
            "ask for a copy of the information we hold about you;",
            "ask us to correct information that's wrong or incomplete;",
            "ask us to delete your information;",
            "ask us to restrict, or object to, how we use it;",
            "ask for your information in a portable format.",
          ],
          "To use any of these rights, contact us through the contact form. We'll reply within one month. If you're unhappy with how we've handled your information, you can complain to the Information Commissioner's Office (ICO) at ico.org.uk or on 0303 123 1113.",
        ],
      },
      {
        heading: "Children",
        body: ["Our services are for businesses and adults. We don't knowingly collect information from children under 13."],
      },
      {
        heading: "Changes to this policy",
        body: ["We'll update this page if anything changes, and change the date at the top."],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    description: "xanti.dev sets no cookies and runs no trackers. Here's the one small piece of browser storage it does use.",
    intro:
      "Cookies are small files a website saves in your browser. This page explains what xanti.dev stores in your browser, which is very little.",
    sections: [
      {
        heading: "We don't use cookies",
        body: [
          "xanti.dev sets no cookies at all: no analytics cookies, no advertising cookies and no third-party cookies. That's why there's no cookie banner.",
        ],
      },
      {
        heading: "What we do store",
        body: [
          "The site saves one value in your browser's session storage, which is cleared when you close the tab:",
          [
            "xanti-loader-seen: remembers that you've already seen the loading screen in this visit, so it's shorter on the next page. It holds no personal information and is never sent to us.",
          ],
          "Because it's needed for the site to work as designed and stays on your device, it doesn't need your consent under the UK's PECR rules. You can clear it at any time from the Cookie settings page.",
        ],
      },
      {
        heading: "Other websites",
        body: [
          "The site's fonts, images and motion reel are all served from xanti.dev itself, so loading a page doesn't contact other companies. When you follow a link to another site, such as Instagram, LinkedIn, X or GitHub, that site's own cookie policy applies.",
        ],
      },
      {
        heading: "If this changes",
        body: [
          "If we ever add analytics or anything else that uses cookies, we'll ask for your permission first, update this page, and let you change your choice on the Cookie settings page.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "The terms for using xanti.dev and for website, branding and graphic design work from xanti studios.",
    intro:
      "These terms cover your use of xanti.dev and any design or development work we do for you. Your quote may add details for a particular project; if the two disagree, the quote wins.",
    sections: [
      { heading: "About us", body: [WHO] },
      {
        heading: "Using this website",
        body: [
          "You're welcome to browse xanti.dev and share links to it. The site's content is provided for general information and may change. Please follow our Acceptable Use Policy while using it.",
        ],
      },
      {
        heading: "Quotes and starting work",
        body: [
          [
            "Every project starts with a written quote setting out what's included, the price and a rough timeline.",
            "Quotes are valid for 30 days unless they say otherwise.",
            "Work starts once you've accepted the quote in writing (an email is fine) and paid any deposit the quote asks for.",
          ],
        ],
      },
      {
        heading: "Your responsibilities",
        body: [
          [
            "Provide the text, images, logins and feedback the project needs, in good time.",
            "Make sure you have the right to use anything you give us, and that it's lawful.",
            "Check the finished work before it goes live.",
          ],
        ],
      },
      {
        heading: "Changes and revisions",
        body: [
          "Your quote says how many rounds of changes are included. Extra changes, or new work outside the quote, will be quoted separately before we do them.",
        ],
      },
      {
        heading: "Payment",
        body: [
          [
            "Invoices are due within 14 days unless your quote says otherwise.",
            "Third-party costs, such as domain names, hosting, paid plugins or stock images, are paid by you, either directly or recharged at cost.",
            "We may pause work, or hold back going live, while an invoice is overdue.",
          ],
        ],
      },
      {
        heading: "Ownership",
        body: [
          "Once you've paid in full, you own the website design and the content we create specifically for you. We keep ownership of our own tools, code libraries and know-how that existed before your project, and give you a permanent licence to use them as part of your site.",
          "We may show the finished work in our portfolio unless you ask us not to.",
        ],
      },
      {
        heading: "Ending a project",
        body: [
          "Either of us can end a project by telling the other in writing. You pay for the work done up to that point. If you're a consumer rather than a business, you also have the right to cancel within 14 days of accepting a quote; if you ask us to start within those 14 days, you pay for the work done before you cancel.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "We do our work with reasonable care and skill. We aren't liable for indirect losses, such as lost profits or lost data, or for problems caused by third-party services like hosting providers. Our total liability for a project is limited to the amount you've paid us for it.",
          "Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or anything else that can't be limited by law, and nothing affects your statutory rights as a consumer.",
        ],
      },
      {
        heading: "Personal data",
        body: [
          "Our Privacy Policy explains how we handle your information. If we process personal data for you, for example through forms on a site we host, our Data Processing Agreement applies too.",
        ],
      },
      {
        heading: "Law",
        body: ["These terms are governed by the law of England and Wales, and its courts deal with any disputes."],
      },
    ],
  },
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    description: "What you can and can't do when using xanti.dev or a website xanti studios builds or hosts for you.",
    intro:
      "This policy applies to anyone using xanti.dev, and to clients using any website or service we build, host or manage for them. It's part of our Terms of Service.",
    sections: [
      {
        heading: "You must not",
        body: [
          [
            "use the site or our services for anything unlawful, fraudulent or harmful;",
            "try to break into, overload or disrupt the site, our hosting or any connected systems;",
            "upload or link to malware, or anything designed to harm devices or data;",
            "send spam, bulk or automated messages through the contact form;",
            "copy the site's content or designs and present them as your own;",
            "scrape the site in a way that affects how it runs for others;",
            "ask us to publish content that is defamatory, hateful, harassing, infringes someone else's rights, or is otherwise illegal.",
          ],
        ],
      },
      {
        heading: "Client websites",
        body: [
          "If we build or host a website for you, you're responsible for the content you add to it and for following the law that applies to your business, including data protection and consumer law.",
        ],
      },
      {
        heading: "If this policy is broken",
        body: [
          "We may remove content, block access, or suspend or end our services. Where the law requires it, we may report illegal activity to the relevant authorities.",
        ],
      },
      {
        heading: "Reporting a problem",
        body: ["If you see something on a site we run that breaks this policy, please tell us through the contact form."],
      },
    ],
  },
  {
    slug: "data-processing",
    title: "Data Processing Agreement",
    description:
      "How xanti studios processes personal data on behalf of clients, as a processor under Article 28 of the UK GDPR.",
    intro:
      "When we build, host or manage a website that collects personal data for you, such as enquiries from your customers, you're the controller of that data and we're your processor. This agreement sets out how we handle it, as Article 28 of the UK GDPR requires. It forms part of our Terms of Service.",
    sections: [
      {
        heading: "What's covered",
        body: [
          [
            "Subject: running and supporting your website and the services connected to it.",
            "Duration: for as long as we provide those services, plus the time needed to return or delete the data.",
            "Types of personal data: usually contact details and the content of messages or forms submitted through your site.",
            "People the data is about: your website's visitors, customers and enquirers.",
          ],
        ],
      },
      {
        heading: "What we agree to",
        body: [
          [
            "Only process the data on your documented instructions, including these terms and your quote, unless the law requires otherwise.",
            "Make sure anyone who handles the data is bound by confidentiality.",
            "Keep the data secure, with appropriate technical and organisational measures: encrypted connections (HTTPS), access limited to the people who need it, strong passwords and two-factor authentication on accounts that hold it, and keeping software up to date.",
            "Only use other providers (sub-processors) under written terms that protect the data in the same way. We'll tell you before adding or changing one, so you can object.",
            "Help you respond when people use their data protection rights, and with security, breach notification and data protection impact assessments, where it's relevant to our work.",
            "Tell you without undue delay after becoming aware of a personal data breach affecting your data.",
            "At the end of our services, delete or return the data, as you choose, unless the law requires us to keep it.",
            "Give you the information you need to show this agreement is being followed, and allow reasonable audits.",
          ],
        ],
      },
      {
        heading: "Current sub-processors",
        body: [
          "Depending on your project, these may include your website hosting provider, a form delivery service such as Web3Forms, and an email provider. Your quote lists the ones your project uses.",
        ],
      },
      {
        heading: "International transfers",
        body: [
          "If a sub-processor handles data outside the UK, we'll only use one covered by UK adequacy regulations or appropriate safeguards, such as the UK International Data Transfer Agreement or Addendum.",
        ],
      },
      {
        heading: "Your responsibilities",
        body: [
          "As controller, you decide why and how the data is collected, make sure you have a lawful basis for it, and give your site's visitors a privacy notice. We can help you write one.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    description: "How xanti.dev is built to be usable by everyone, its known limitations, and how to report a problem.",
    intro:
      "We want everyone to be able to use xanti.dev, whatever device or assistive technology they use. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
    sections: [
      {
        heading: "What we've done",
        body: [
          [
            "Pages use proper headings, landmarks and labels, so screen readers can move around them.",
            "Images that carry meaning have text descriptions; decorative ones are hidden from screen readers.",
            "Links, buttons and the contact form can be used with a keyboard.",
            "If your device is set to reduce motion, the scroll animations, loading screen and moving effects are turned off.",
            "Links and buttons are at least 48 by 48 pixels, so they're easy to tap.",
            "Zoom is never blocked, so you can enlarge text and pages.",
          ],
        ],
      },
      {
        heading: "Known limitations",
        body: [
          [
            "Some smaller grey text, such as captions and labels, is lighter than WCAG AA recommends. If any text is hard to read, please tell us.",
            "Some sections are long, pinned scroll animations. With reduced motion turned on, they show as normal static content.",
            "The pixel-art backgrounds and the motion reel are decorative and have no spoken content.",
            "Certificate images contain text that isn't fully described in the image description; their titles and issuers are written out next to them.",
          ],
        ],
      },
      {
        heading: "Report a problem",
        body: [
          "If anything on the site is hard to use, or you need information in a different format, please tell us through the contact form. We'll reply as soon as we can, and fix what we're able to.",
          "If you're not happy with our response, you can contact the Equality Advisory and Support Service (EASS).",
        ],
      },
    ],
  },
  {
    slug: "how-we-contact-you",
    title: "How we contact you",
    description: "The only ways xanti studios will get in touch, and how to spot messages that aren't really from us.",
    intro: "Scams that copy real businesses are common. This page sets out how we will and won't contact you, so you can check a message is really from us.",
    sections: [
      {
        heading: "How we'll contact you",
        body: [
          [
            "By email, in reply to a message you've sent us, or about a project we're working on together.",
            "By phone or video call, only when we've arranged it with you first.",
            "On social media, only from our own accounts, @h4tfi3ld on Instagram, X and LinkedIn, and only if you've messaged us there first.",
          ],
        ],
      },
      {
        heading: "What we'll never do",
        body: [
          [
            "Ask for your passwords, card details or bank login by email, phone or message.",
            "Send you marketing emails you haven't signed up for.",
            "Pressure you to pay urgently, or ask you to pay into a new account without confirming it with you another way.",
            "Contact you from an account or address that isn't linked from this website.",
          ],
        ],
      },
      {
        heading: "Invoices and payments",
        body: [
          "Invoices come by email and match the price in your quote. If bank details ever seem to have changed, don't pay: check with us through the contact form on this website first.",
        ],
      },
      {
        heading: "Not sure a message is from us?",
        body: [
          "Don't click any links or reply to it. Contact us through the form at xanti.dev/contact and we'll tell you whether it's genuine. You can report scam emails to the National Cyber Security Centre by forwarding them to report@phishing.gov.uk.",
        ],
      },
    ],
  },
  {
    slug: "site-statistics",
    title: "Site statistics",
    description: "What xanti.dev measures about visits (very little), and the privacy-friendly numbers behind it.",
    intro: "Lots of websites track every click. This one doesn't. Here's exactly what we can and can't see about your visit.",
    sections: [
      {
        heading: "At a glance",
        body: [
          [
            "Cookies set: 0",
            "Analytics or advertising trackers: 0",
            "Third-party scripts loaded: 0",
            "Third-party requests when a page loads: 0 (fonts, images and the motion reel are all served from xanti.dev)",
          ],
        ],
      },
      {
        heading: "What we can see",
        body: [
          [
            "Overall traffic figures from our hosting provider, such as the number of requests and the amount of data served. These are totals and don't identify you.",
            "Search figures from Google Search Console: which searches showed the site, and how often people clicked through. Google only shares these as anonymous totals.",
          ],
        ],
      },
      {
        heading: "What we can't see",
        body: [
          "We don't know who you are, which pages you read, how long you stayed or where you came from, unless you tell us in a message. We don't build profiles of visitors and we don't share visit data with advertisers.",
        ],
      },
      {
        heading: "If this changes",
        body: [
          "If we ever add analytics, we'll choose a privacy-friendly, cookie-free tool where we can, ask for consent where the law requires it, and update this page and the Cookie Policy first.",
        ],
      },
    ],
  },
];

/** Footer order. */
export const legalLinks = [
  { label: "Acceptable Use Policy", href: "/legal/acceptable-use" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Data Processing Agreement", href: "/legal/data-processing" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Cookie Policy", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "How we contact you", href: "/legal/how-we-contact-you" },
  { label: "Site statistics", href: "/legal/site-statistics" },
  { label: "Cookie settings", href: "/legal/cookie-settings" },
];
