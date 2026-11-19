import { EDUCATOR_TYPES, PACKAGES } from '../data/pricing';

/**
 * Mentors Studio — Centralised Site & SEO Configuration
 *
 * All domain, phone, WhatsApp, email, and address tokens are managed here as a
 * single source of truth. When real credentials/domains are finalised, changing
 * them here will automatically propagate across all meta tags, schema markup,
 * canonical links, sitemaps, and contact UI.
 */

export const siteConfig = {
  domain: 'mentorsstudio.co.in',
  siteUrl: 'https://mentorsstudio.co.in',
  name: 'Mentors Studio',
  alternateName: 'Mentors Studio by The Vensej',
  brandLine: 'by The Vensej',
  tagline: 'You Bring the Knowledge. We Provide the Space.',
  brandTagline: 'Learn · Create · Grow',
  description:
    'Furnished, managed classroom and teaching space rental for educators in Gurugram. 9 air-conditioned cabins from 6 to 24 seats on Golf Course Extension Road, Sector 57. Pay per seat, flexible monthly packages.',

  // NAP (Name, Address, Phone) & Contact
  contact: {
    phone: '+91 99900 35865',
    phoneDisplay: '+91 99900 35865',
    whatsapp: '919990035865',
    whatsappDisplay: '+91 99900 35865',
    email: 'info@mentorsstudio.co.in',
    address: {
      floorUnit: 'Unit 204, Second Floor',
      mallName: 'Hong Kong Bazaar Mall',
      street: 'Golf Course Extension Road, Sector 57',
      locality: 'Sector 57, Golf Course Extension Road',
      city: 'Gurugram',
      region: 'Haryana',
      postalCode: '122003',
      country: 'IN',
      countryName: 'India',
    },
    geo: {
      latitude: '28.4239',
      longitude: '77.0827',
    },
    mapsUrl: 'https://maps.google.com/?q=Golf+Course+Extension+Road+Sector+57+Gurugram',
    operatingHours: 'Monday–Saturday, 10:00 am – 8:25 pm',
    sundayHours: 'Three Sundays a month by prior manager arrangement',
  },

  // Social & GBP Links
  social: {
    googleBusinessProfile: '[GOOGLE_BUSINESS_PROFILE_URL]',
    instagram: '[INSTAGRAM_URL]',
    facebook: '[FACEBOOK_URL]',
  },

  // Default sharing assets
  ogImage: '/images/reception-lobby.png',

  // Programmatic pricing references
  rates: {
    adultPerSession: EDUCATOR_TYPES.find((e) => e.id === 'adult')?.baseRate ?? 250,
    schoolPerSession: EDUCATOR_TYPES.find((e) => e.id === 'school')?.baseRate ?? 200,
  },
  packages: PACKAGES,
};

