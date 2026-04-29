import Link from 'next/link';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { formatDate } from '@/lib/blog-shared';
import { getPublishedPostBySlug, type BlogLocale } from '@/lib/content-posts';
import { withBasePath } from '@/lib/paths';
import { getSiteUrl, SITE_NAME } from '@/lib/seo';
import { ActionBanner } from '@/components/shared/ActionBanner';

type BlogPostPageProps = {
  slug: string;
  basePath: string;
  locale: BlogLocale;
};

const CATEGORY_STYLES: Record<string, string> = {
  Domótica: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
  'Ahorro Energético':
    'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300',
  'Home Assistant': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300',
  Ofertas: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  Reseñas: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
  'Gestión Energética': 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
};

const CATEGORY_ICONS: Record<string, string> = {
  Domótica: '🏠',
  'Ahorro Energético': '⚡',
  'Home Assistant': '🤖',
  Ofertas: '🏷️',
  Reseñas: '⭐',
  'Gestión Energética': '📊',
};

const FALLBACK_STYLE = 'bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300';

export async function BlogPostPage({ slug, basePath, locale }: BlogPostPageProps) {
  const post = await getPublishedPostBySlug(slug, locale);

  if (!post) notFound();

  const categoryStyle = CATEGORY_STYLES[post.category] ?? FALLBACK_STYLE;
  const icon = CATEGORY_ICONS[post.category] ?? '📄';

  const cleanContent = post.content
    .replace(/<!-- wp:[^>]*?-->/g, '')
    .replace(/<!-- \/wp:[^>]*?-->/g, '')
    .trim();

  const safeContent = sanitizeHtml(cleanContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'span',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ]),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });

  const baseUrl = getSiteUrl();
  const articlePath = withBasePath(basePath, `/blog/${slug}`);
  const articleUrl = new URL(articlePath, baseUrl).toString();
  const imageUrl =
    post.featuredImage && !post.featuredImage.startsWith('/images/')
      ? post.featuredImage
      : new URL('/images/hero_home.png', baseUrl).toString();

  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: new URL('/images/hero_home.png', baseUrl).toString() },
    },
  });

  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Blog',
        item: new URL(withBasePath(basePath, '/blog'), baseUrl).toString(),
      },
      { '@type': 'ListItem', position: 2, name: post.title, item: articleUrl },
    ],
  });

  const hasRealImage = post.featuredImage && !post.featuredImage.startsWith('/images/');

  return (
    <article className="min-h-screen bg-background pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />

      {/* Cabecera del artículo */}
      <header className="border-b border-zinc-100 bg-background dark:border-white/5 pt-10 pb-12">
        <div className="mx-auto max-w-3xl px-5">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-foreground/45">
            <Link
              href={withBasePath(basePath, '/')}
              className="hover:text-foreground/70 transition"
            >
              Inicio
            </Link>
            <span>/</span>
            <Link
              href={withBasePath(basePath, '/blog')}
              className="hover:text-foreground/70 transition"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground/65 line-clamp-1">{post.title}</span>
          </nav>

          {/* Icono + categoría */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-white/5">
              {icon}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${categoryStyle}`}
            >
              {post.category}
            </span>
            <span className="text-sm text-foreground/40">{formatDate(post.date)}</span>
          </div>

          {/* Título */}
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-foreground/60">{post.excerpt}</p>
          )}
        </div>
      </header>

      {/* Imagen destacada real (si existe) */}
      {hasRealImage && (
        <div className="mx-auto max-w-3xl px-5 mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage!}
            alt={post.title}
            className="w-full rounded-3xl object-cover max-h-[420px]"
          />
        </div>
      )}

      {/* Contenido + sidebar */}
      <div className="mx-auto max-w-3xl px-5 mt-10 lg:max-w-6xl">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-12 lg:items-start">
          {/* Artículo */}
          <div className="article-body">
            <div dangerouslySetInnerHTML={{ __html: safeContent }} />
          </div>

          {/* Sidebar */}
          <aside className="mt-12 space-y-4 lg:mt-0 lg:sticky lg:top-24">
            <div className="surface-panel-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45 mb-3">
                Siguiente paso
              </p>
              <p className="text-sm leading-6 text-foreground/65">
                ¿Quieres aterrizar esto en tu caso? Analizamos tu factura sin compromiso.
              </p>
              <Link
                href={withBasePath(basePath, '/estudio')}
                className="cta-primary mt-4 w-full block text-center"
              >
                Estudio gratuito
              </Link>
            </div>
            <div className="surface-panel-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45 mb-3">
                Contacto directo
              </p>
              <p className="text-sm leading-6 text-foreground/65">
                Si prefieres hablar con el equipo, respondemos en menos de 24h.
              </p>
              <Link
                href={withBasePath(basePath, '/contacto')}
                className="cta-secondary mt-4 w-full block text-center"
              >
                Escribir al equipo
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer del artículo */}
      <div className="mx-auto max-w-3xl px-5 mt-16 lg:max-w-6xl">
        <ActionBanner
          title="Convierte la lectura en una decisión concreta"
          description="Analizamos tu contrato de luz y te devolvemos una recomendación accionable, clara y sin compromiso."
          action={
            <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
              Solicitar estudio gratuito
            </Link>
          }
        />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-sm dark:border-white/10 sm:flex-row">
          <Link
            href={withBasePath(basePath, '/blog')}
            className="font-semibold text-foreground/60 hover:text-primary-600 dark:hover:text-primary-300 transition"
          >
            ← Volver al blog
          </Link>
          <Link
            href={withBasePath(basePath, '/contacto')}
            className="text-foreground/45 hover:text-foreground/70 transition"
          >
            ¿Prefieres hablar con el equipo?
          </Link>
        </div>
      </div>
    </article>
  );
}
