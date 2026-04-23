import Link from 'next/link';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { formatDate } from '@/lib/blog-shared';
import { getPublishedPostBySlug, type BlogLocale } from '@/lib/content-posts';
import { withBasePath } from '@/lib/paths';
import { getSiteUrl, SITE_NAME } from '@/lib/seo';
import { SectionHero } from '@/components/shared/SectionHero';
import { ActionBanner } from '@/components/shared/ActionBanner';

type BlogPostPageProps = {
  slug: string;
  basePath: string;
  locale: BlogLocale;
};

const CATEGORY_COLORS: Record<string, string> = {
  Domótica: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
  'Ahorro Energético':
    'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300',
  'Home Assistant': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300',
  Ofertas: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  Reseñas: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
  'Gestión Energética': 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
};

export async function BlogPostPage({ slug, basePath, locale }: BlogPostPageProps) {
  const post = await getPublishedPostBySlug(slug, locale);

  if (!post) notFound();

  const categoryClass =
    CATEGORY_COLORS[post.category] ??
    'bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300';
  const cleanContent = post.content
    .replace(/<!-- wp:[^>]*?-->/g, '')
    .replace(/<!-- \/wp:[^>]*?-->/g, '')
    .trim();
  const safeContent = sanitizeHtml(cleanContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'span']),
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

  return (
    <article className="min-h-screen bg-background pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />

      <SectionHero
        eyebrow="Artículo"
        title={post.title}
        subtitle={
          post.excerpt ||
          'Una guía práctica pensada para entender mejor la energía, la domótica y las decisiones que realmente mueven ahorro.'
        }
        compact
        align="center"
      />

      <section className="section-shell-tight">
        <div className="section-inner max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span
              className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.14em] ${categoryClass}`}
            >
              {post.category}
            </span>
            <span className="text-foreground/40">•</span>
            <span className="text-foreground/55">{formatDate(post.date)}</span>
          </div>

          {post.featuredImage && !post.featuredImage.startsWith('/images/') ? (
            <div className="surface-panel overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt={post.title}
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <div
              className="prose prose-zinc dark:prose-invert max-w-none prose-lg prose-p:text-foreground/80 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-headings:text-foreground dark:prose-headings:text-white prose-headings:font-heading prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-a:text-primary-600 dark:prose-a:text-primary-300 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground dark:prose-strong:text-white prose-li:text-foreground/80 dark:prose-li:text-zinc-300 prose-img:rounded-[1.4rem] prose-img:shadow-xl prose-blockquote:border-primary-500 prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-white/5 prose-blockquote:rounded-r-2xl prose-blockquote:px-6 prose-blockquote:py-4"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="surface-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  En esta guía
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground/70">
                  Una lectura enfocada a entender mejor el contexto, evaluar opciones y enlazar el
                  contenido con una siguiente acción práctica.
                </p>
              </div>
              <div className="surface-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  Siguiente paso
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground/70">
                  Si quieres aterrizar estas ideas sobre tu caso real, la mejor vía sigue siendo
                  partir de tu factura o tu consumo.
                </p>
                <Link href={withBasePath(basePath, '/estudio')} className="cta-primary mt-5 w-full">
                  Pedir estudio
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-shell-tight pb-12">
        <div className="section-inner max-w-6xl">
          <ActionBanner
            title="Convierte la lectura en una decisión concreta"
            description="Analizamos tu contrato de luz o tu escenario energético y te devolvemos una recomendación accionable, clara y sin compromiso."
            action={
              <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
                Solicitar estudio gratuito
              </Link>
            }
          />
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-sm dark:border-white/10 sm:flex-row">
            <Link
              href={withBasePath(basePath, '/blog')}
              className="font-semibold text-foreground/65 hover:text-primary-600 dark:hover:text-primary-300"
            >
              ← Volver al blog
            </Link>
            <Link
              href={withBasePath(basePath, '/contacto')}
              className="text-foreground/50 hover:text-foreground/75"
            >
              ¿Prefieres hablar con el equipo?
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
