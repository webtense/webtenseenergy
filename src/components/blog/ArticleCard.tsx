import Link from 'next/link';
import { withBasePath } from '@/lib/paths';

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

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  featuredImage?: string | null;
  basePath?: string;
}

export function ArticleCard({
  title,
  excerpt,
  category,
  date,
  slug,
  featuredImage,
  basePath = '',
}: ArticleCardProps) {
  const categoryStyle = CATEGORY_STYLES[category] ?? FALLBACK_STYLE;
  const icon = CATEGORY_ICONS[category] ?? '📄';
  const hasRealImage = featuredImage && !featuredImage.startsWith('/images/blog-placeholder');

  return (
    <Link
      href={withBasePath(basePath, `/blog/${slug}`)}
      className="surface-panel-soft group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-500/20"
    >
      {hasRealImage ? (
        <div className="relative h-44 overflow-hidden bg-zinc-100 dark:bg-[#06111d]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featuredImage}
            alt={title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="px-6 pt-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-2xl dark:bg-white/5">
            {icon}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${categoryStyle}`}
          >
            {category}
          </span>
          <span className="text-xs font-medium text-foreground/40">{date}</span>
        </div>
        <h3 className="mt-4 font-heading text-lg font-bold leading-snug tracking-tight text-foreground transition group-hover:text-primary-600 dark:group-hover:text-primary-300">
          {title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-foreground/60">{excerpt}</p>
        <div className="mt-4 text-xs font-semibold text-primary-600 dark:text-primary-300">
          Leer artículo →
        </div>
      </div>
    </Link>
  );
}
