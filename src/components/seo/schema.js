import { siteConfig } from '../../config/siteConfig';
import { PACKAGES } from '../../data/pricing';

/**
 * Generates LocalBusiness Schema (Section 7.1)
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    description: siteConfig.description,
    url: `${siteConfig.siteUrl}/`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: '₹₹',
    image: `${siteConfig.siteUrl}/images/reception-lobby.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.region,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.contact.geo.latitude,
      longitude: siteConfig.contact.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '10:00',
        closes: '20:29',
      },
    ],
    sameAs: [
      siteConfig.social.googleBusinessProfile,
      siteConfig.social.instagram,
      siteConfig.social.facebook,
    ],
  };
}

/**
 * Generates Product/Offer Schema programmatically from src/data/pricing.js (Section 7.2)
 */
export function getPricingProductSchemas() {
  return PACKAGES.map((pkg) => {
    const discountedRate = (siteConfig.rates.adultPerSession * (1 - pkg.discount)).toFixed(0);
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `Classroom Seat Rental — ${pkg.label}`,
      description: `Per-seat classroom rental session for educators at Mentors Studio, Gurugram. Package includes ${pkg.sessions} session${pkg.sessions > 1 ? 's' : ''}${pkg.months ? ` with ${pkg.months}-month validity` : ''}.`,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: discountedRate,
        availability: 'https://schema.org/InStock',
        url: `${siteConfig.siteUrl}/pricing`,
      },
    };
  });
}

/**
 * Generates FAQPage Schema (Section 7.3)
 */
export function getFAQSchema(faqList) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((item) => ({
      '@type': 'Question',
      name: item.question || item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer || item.a,
      },
    })),
  };
}

/**
 * Generates BreadcrumbList Schema (Section 7.4)
 */
export function getBreadcrumbSchema(items) {
  const fullItems = [
    { name: 'Home', path: '/' },
    ...items,
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => {
      const p = item.path || '/';
      const cleanPath = p === '/' ? '/' : (p.startsWith('/') ? p : `/${p}`);
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${siteConfig.siteUrl}${cleanPath}`,
      };
    }),
  };
}
