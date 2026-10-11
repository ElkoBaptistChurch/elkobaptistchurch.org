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

/** Stable JSON-LD node identifiers, so entities can reference each other by @id. */
export const CHURCH_ID = `${siteConfig.url}/#church`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

/** JSON-LD node: the church itself (single canonical entity, emitted site-wide). */
export function churchSchema(): Record<string, unknown> {
  return {
    '@type': ['Church', 'Organization'],
    '@id': CHURCH_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    image: `${siteConfig.url}/images/Church-outside.jpg`,
    description: siteConfig.description,
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
    hasMap: siteConfig.contact.mapsUrl,
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

/** JSON-LD node: the website, published by the church. */
export function websiteSchema(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: 'en-US',
    publisher: { '@id': CHURCH_ID },
  };
}

/** JSON-LD: site-wide graph (Church + WebSite), emitted once per page by BaseLayout. */
export function siteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [churchSchema(), websiteSchema()],
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
    isPartOf: { '@id': WEBSITE_ID },
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

/** Serialize JSON-LD for use in <script type="application/ld+json"> */
export function jsonLd(schema: object): string {
  return JSON.stringify(schema, null, 0);
}
