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
  domain: '[YOUR_DOMAIN]',
  siteUrl: 'https://[YOUR_DOMAIN]',
  name: 'Mentors Studio',
  alternateName: 'Mentors Studio by The Vensej',
  brandLine: 'by The Vensej',
  tagline: 'You Bring the Knowledge. We Provide the Space.',
  brandTagline: 'Learn · Create · Grow',
  description:
    'Furnished, managed classroom and teaching space rental for educators in Gurugram. 9 air-conditioned cabins from 6 to 24 seats on Golf Course Extension Road, Sector 57. Pay per seat, no deposit.',

  // NAP (Name, Address, Phone) & Contact placeholders
  contact: {
    phone: '[PHONE_NUMBER]',
    phoneDisplay: '[PHONE_NUMBER]',
    whatsapp: '[WHATSAPP_NUMBER]',
    email: '[EMAIL_ADDRESS]',
    address: {
      floorUnit: '[FLOOR_UNIT]',
      mallName: '[MALL_NAME]',
      street: '[FLOOR_UNIT], [MALL_NAME], Golf Course Extension Road, Sector 57',
      locality: 'Sector 57, Golf Course Extension Road',
      city: 'Gurugram',
      region: 'Haryana',
      postalCode: '122003',
      country: 'IN',
      countryName: 'India',
    },
    geo: {
      latitude: '[LATITUDE]',
      longitude: '[LONGITUDE]',
    },
    mapsUrl: 'https://maps.google.com/?q=Golf+Course+Extension+Road+Sector+57+Gurugram',
    operatingHours: 'Monday–Saturday, 10:00 am – 8:29 pm',
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
    adultPerSession: EDUCATOR_TYPES.find((e) => e.id === 'adult')?.ratePerSeat ?? 250,
    schoolPerSession: EDUCATOR_TYPES.find((e) => e.id === 'school')?.ratePerSeat ?? 200,
  },
  packages: PACKAGES,
};

