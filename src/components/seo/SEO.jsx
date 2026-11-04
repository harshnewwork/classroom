import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../config/siteConfig';
import { getBreadcrumbSchema } from './schema';

/**
 * Reusable SEO component injecting page-specific Helmet tags & structured data JSON-LD.
 *
 * @param {string} title - Page title (< 60 chars)
 * @param {string} description - Meta description (140-155 chars)
 * @param {string} canonicalPath - Route path, e.g. '/pricing'
 * @param {string} [ogType='website'] - Open Graph type
 * @param {string} [ogImage] - Relative image path, e.g. '/images/reception-lobby.png'
 * @param {Array|Object} [schema] - One or more JSON-LD schema objects
 * @param {Array<{name: string, path: string}>} [breadcrumbs] - Breadcrumb items for BreadcrumbList schema
 */
export function SEO({
  title,
  description,
  canonicalPath = '/',
  ogType = 'website',
  ogImage = siteConfig.ogImage,
  schema = null,
  breadcrumbs = null,
}) {
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = cleanPath === '/' ? `${siteConfig.siteUrl}/` : `${siteConfig.siteUrl}${cleanPath}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteConfig.siteUrl}${ogImage}`;

  // Assemble all schema objects
  const allSchemas = [];

  if (breadcrumbs && breadcrumbs.length > 0) {
    allSchemas.push(getBreadcrumbSchema(breadcrumbs));
  }

  if (Array.isArray(schema)) {
    allSchemas.push(...schema.filter(Boolean));
  } else if (schema) {
    allSchemas.push(schema);
  }

  return (
    <Helmet prioritizeSeoTags>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Structured Data JSON-LD */}
      {allSchemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

