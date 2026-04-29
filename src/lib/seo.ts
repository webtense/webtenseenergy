import type { Metadata } from 'next';
import { normalizePath } from '@/lib/paths';

export const SITE_NAME = 'WEBTENSE ENERGY';
export const DEFAULT_SITE_URL = 'https://webtenseenergy.com';
export const SUPPORTED_LOCALES = ['es', 'ca'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const OG_LOCALE_MAP: Record<Locale, string> = {
  es: 'es_ES',
  ca: 'ca_ES',
};

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function getLocalePath(locale: Locale | 'root', path: string): string {
  const normalized = normalizePath(path);
  if (locale === 'root') return normalized;
  if (normalized === '/') return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function buildAlternates(path: string, locale: Locale | 'root') {
  const baseUrl = getSiteUrl();
  const normalized = normalizePath(path);
  const canonical = new URL(getLocalePath(locale, normalized), baseUrl).toString();

  return {
    canonical,
    languages: {
      es: new URL(getLocalePath('es', normalized), baseUrl).toString(),
      ca: new URL(getLocalePath('ca', normalized), baseUrl).toString(),
      'x-default': new URL(getLocalePath('root', normalized), baseUrl).toString(),
    },
  };
}

export function buildPageMetadata(params: {
  title: string;
  description: string;
  path: string;
  locale: Locale | 'root';
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const baseUrl = getSiteUrl();
  const alternates = buildAlternates(params.path, params.locale);
  const ogImage = params.image
    ? new URL(params.image, baseUrl).toString()
    : new URL('/images/hero_home.png', baseUrl).toString();
  const localeKey = params.locale === 'root' ? 'es' : params.locale;

  return {
    title: params.title,
    description: params.description,
    metadataBase: new URL(baseUrl),
    alternates,
    openGraph: {
      title: params.title,
      description: params.description,
      type: params.type || 'website',
      locale: OG_LOCALE_MAP[localeKey],
      siteName: SITE_NAME,
      url: alternates.canonical,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [ogImage],
    },
  };
}

export function buildOrganizationSchema() {
  const baseUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: baseUrl,
    logo: new URL('/images/hero_home.png', baseUrl).toString(),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34 691 521 367',
      contactType: 'customer service',
      areaServed: 'ES',
      availableLanguage: ['es', 'ca'],
    },
    sameAs: ['https://t.me/webtenseenergy'],
  };
}

export function buildFAQSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildWebsiteSchema() {
  const baseUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
