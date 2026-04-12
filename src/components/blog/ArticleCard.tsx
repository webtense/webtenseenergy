import Link from "next/link";
import { withBasePath } from "@/lib/paths";

const CATEGORY_STYLES: Record<string, string> = {
  "Domótica": "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
  "Ahorro Energético": "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300",
  Ofertas: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Reseñas: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  "Gestión Energética": "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
};

const FALLBACK = "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  featuredImage?: string | null;
  basePath?: string;
}

export function ArticleCard({ title, excerpt, category, date, slug, featuredImage, basePath = "" }: ArticleCardProps) {
  const categoryStyle = CATEGORY_STYLES[category] ?? FALLBACK;

  return (
    <Link
      href={withBasePath(basePath, `/blog/${slug}`)}
      className="surface-panel-soft group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-500/20"
    >
      <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-[#06111d]">
        {featuredImage && !featuredImage.startsWith("/images/blog-placeholder") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={featuredImage} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(26,183,117,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(59,118,246,0.16),transparent_34%)] px-8 text-center">
            <span className="font-heading text-3xl font-bold tracking-tight text-foreground/25">{category}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${categoryStyle}`}>{category}</span>
          <span className="text-xs font-medium text-foreground/45">{date}</span>
        </div>
        <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground transition group-hover:text-primary-600 dark:group-hover:text-primary-300">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-foreground/70">{excerpt}</p>
        <div className="mt-6 text-sm font-semibold text-primary-600 dark:text-primary-300">Leer artículo →</div>
      </div>
    </Link>
  );
}
