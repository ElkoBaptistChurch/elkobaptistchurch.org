import { siteConfig } from '@/data/site';

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
}

export function buildTitle(pageTitle: string): string {
  if (!pageTitle || pageTitle.toLowerCase() === 'home') {
    return `${siteConfig.name} — Elko, Georgia`;
  }
  return `${pageTitle} | ${siteConfig.name}`;
}

export function buildCanonical(path: string): string {
  return `${siteConfig.url}${path}`;
}

export function buildOgImageUrl(imagePath?: string): string {
  return imagePath
    ? `${siteConfig.url}${imagePath}`
    : `${siteConfig.url}/images/og-default.jpg`;
}

/** JSON-LD: Organization schema (used site-wide) */
export function organizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Church'],
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.zip,
      addressCountry: 'US',
    },
    email: siteConfig.contact.email,
    sameAs: [siteConfig.social.facebook, siteConfig.social.youtube],
    foundingDate: String(siteConfig.founding.year),
    areaServed: [
      { '@type': 'City', name: 'Elko', containedInPlace: { '@type': 'AdministrativeArea', name: 'Houston County' } },
      { '@type': 'City', name: 'Perry' },
      { '@type': 'City', name: 'Warner Robins' },
      { '@type': 'AdministrativeArea', name: 'Houston County, Georgia' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '12:30',
      },
    ],
  };
}

/** JSON-LD: WebPage schema */
export function webPageSchema(meta: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title,
    description: meta.description,
    url: meta.url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteConfig.url,
        },
        ...meta.breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 2,
          name: crumb.name,
          item: crumb.url,
        })),
      ],
    };
  }

  return schema;
}

/** JSON-LD: Local Business / Church for contact/homepage */
export function localBusinessSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#church`,
    name: siteConfig.name,
    image: `${siteConfig.url}/images/church-exterior.jpg`,
    url: siteConfig.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.332915,
      longitude: -83.708750,
    },
    priceRange: 'Free',
  };
}

/** Serialize JSON-LD for use in <script type="application/ld+json"> */
export function jsonLd(schema: object): string {
  return JSON.stringify(schema, null, 0);
}
