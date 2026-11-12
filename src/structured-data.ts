import { contact, siteUrl, socials } from "@/content";

/*
 * The homepage's schema.org graph: the studio (Organization), what it offers
 * (Service) and the website itself (WebSite), linked by @id.
 *
 * Service rather than LocalBusiness: a LocalBusiness is a place customers
 * visit, and Google expects a street address for it. xanti studios works
 * remotely and keeps addresses off the site, so it describes the work and
 * the area served instead.
 */
const ORG_ID = `${siteUrl}/#organization`;

const telephone = contact.phone.replace(/[^\d+]/g, "");

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "xanti studios",
      alternateName: "xanti",
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/websiteicon.png`,
        width: 156,
        height: 154,
      },
      description:
        "A web design, web development and graphic design studio in Devon, UK, by @h4tfi3ld: websites, web apps, posters and social graphics.",
      founder: { "@type": "Person", name: "@h4tfi3ld" },
      sameAs: socials.map((s) => s.href),
      ...(contact.email || telephone
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: "English",
              ...(contact.email && { email: contact.email }),
              ...(telephone && { telephone }),
            },
          }
        : {}),
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: "Web development and graphic design",
      serviceType: "Web design and development",
      url: `${siteUrl}/`,
      provider: { "@id": ORG_ID },
      areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "AdministrativeArea", name: "Devon" },
      ],
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${siteUrl}/contact`,
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          "Website design and development",
          "Web app development",
          "Graphic design: posters, campaigns and social graphics",
        ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "xanti studios",
      url: `${siteUrl}/`,
      publisher: { "@id": ORG_ID },
      inLanguage: "en-GB",
    },
  ],
};
