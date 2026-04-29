import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getSiteUrl,
  getLocalePath,
  buildAlternates,
  buildPageMetadata,
  buildOrganizationSchema,
  buildWebsiteSchema,
  DEFAULT_SITE_URL,
  SITE_NAME,
} from '../seo';

describe('getSiteUrl', () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it('retorna DEFAULT_SITE_URL si la variable de entorno no está definida', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });

  it('retorna la URL de la variable de entorno cuando está definida', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://staging.example.com';
    expect(getSiteUrl()).toBe('https://staging.example.com');
  });
});

describe('getLocalePath', () => {
  it('construye ruta con locale es', () => {
    expect(getLocalePath('es', '/blog')).toBe('/es/blog');
  });

  it('construye ruta con locale ca', () => {
    expect(getLocalePath('ca', '/contacto')).toBe('/ca/contacto');
  });

  it('devuelve /es para path raíz con locale es', () => {
    expect(getLocalePath('es', '/')).toBe('/es');
  });

  it('devuelve ruta normalizada para locale root', () => {
    expect(getLocalePath('root', '/blog')).toBe('/blog');
  });

  it('devuelve / para path raíz con locale root', () => {
    expect(getLocalePath('root', '/')).toBe('/');
  });
});

describe('buildAlternates', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://webtenseenergy.com';
  });

  it('incluye canonical, es, ca y x-default', () => {
    const result = buildAlternates('/blog', 'es');
    expect(result.canonical).toContain('/es/blog');
    expect(result.languages.es).toContain('/es/blog');
    expect(result.languages.ca).toContain('/ca/blog');
    expect(result.languages['x-default']).toContain('/blog');
  });
});

describe('buildPageMetadata', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://webtenseenergy.com';
  });

  it('incluye title y description', () => {
    const meta = buildPageMetadata({
      title: 'Mi Página',
      description: 'Descripción',
      path: '/contacto',
      locale: 'es',
    });
    expect(meta.title).toBe('Mi Página');
    expect(meta.description).toBe('Descripción');
  });

  it('openGraph type por defecto es website', () => {
    const meta = buildPageMetadata({
      title: 'Test',
      description: 'Desc',
      path: '/',
      locale: 'root',
    });
    // Cast needed: Next.js Metadata OpenGraph type union is complex
    expect((meta.openGraph as { type?: string })?.type).toBe('website');
  });

  it('openGraph type puede ser article', () => {
    const meta = buildPageMetadata({
      title: 'Artículo',
      description: 'Desc',
      path: '/blog/post',
      locale: 'es',
      type: 'article',
    });
    expect((meta.openGraph as { type?: string })?.type).toBe('article');
  });

  it('incluye twitter card', () => {
    const meta = buildPageMetadata({
      title: 'T',
      description: 'D',
      path: '/',
      locale: 'es',
    });
    expect((meta.twitter as { card?: string })?.card).toBe('summary_large_image');
  });
});

describe('buildOrganizationSchema', () => {
  it('retorna un schema de tipo Organization', () => {
    const schema = buildOrganizationSchema();
    expect(schema['@type']).toBe('Organization');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema.name).toBe(SITE_NAME);
  });
});

describe('buildWebsiteSchema', () => {
  it('retorna un schema de tipo WebSite', () => {
    const schema = buildWebsiteSchema();
    expect(schema['@type']).toBe('WebSite');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema.name).toBe(SITE_NAME);
  });

  it('incluye potentialAction de búsqueda', () => {
    const schema = buildWebsiteSchema();
    expect(schema.potentialAction['@type']).toBe('SearchAction');
  });
});
