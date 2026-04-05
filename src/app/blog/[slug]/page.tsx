import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, allPosts, formatDate } from "@/lib/posts";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Genera rutas estáticas para todos los slugs conocidos
export async function generateStaticParams() {
  return allPosts
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug }));
}

// SEO por artículo
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.excerpt?.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt?.substring(0, 160),
      ...(post.featuredImage && !post.featuredImage.startsWith("/images/")
        ? { images: [{ url: post.featuredImage }] }
        : {}),
    },
  };
}

// Colores de categoría
const CATEGORY_COLORS: Record<string, string> = {
  "Domótica": "text-blue-600 dark:text-blue-400",
  "Ahorro Energético": "text-emerald-600 dark:text-green-400",
  "Ofertas": "text-orange-600 dark:text-orange-400",
  "Reseñas": "text-purple-600 dark:text-purple-400",
  "Gestión Energética": "text-yellow-600 dark:text-yellow-400",
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryColor = CATEGORY_COLORS[post.category] ?? "text-primary-600 dark:text-primary-400";

  // Limpiar los comentarios de bloques de Gutenberg del contenido
  const cleanContent = post.content
    .replace(/<!-- wp:[^>]*?-->/g, "")
    .replace(/<!-- \/wp:[^>]*?-->/g, "")
    .trim();

  return (
    <article className="min-h-screen pb-24 bg-background">
      {/* Header del artículo */}
      <header className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/5 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4 text-sm font-medium">
            <span className={`font-bold ${categoryColor}`}>{post.category}</span>
            <span className="text-foreground/40 dark:text-zinc-600">•</span>
            <span className="text-foreground/60 dark:text-zinc-400">{formatDate(post.date)}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-foreground/70 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              {post.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* Imagen destacada */}
      {post.featuredImage && !post.featuredImage.startsWith("/images/") && (
        <div className="container mx-auto px-4 max-w-3xl -mt-6 sm:-mt-10 relative z-10">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Contenido del artículo */}
      <div className="container mx-auto px-4 max-w-3xl mt-12">
        <div
          className="prose prose-zinc dark:prose-invert prose-lg max-w-none
            prose-p:text-foreground/80 dark:prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-headings:text-foreground dark:prose-headings:text-white prose-headings:font-heading
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-a:text-primary-600 dark:prose-a:text-primary-400 hover:prose-a:text-primary-500 dark:hover:prose-a:text-primary-300 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground dark:prose-strong:text-white
            prose-li:text-foreground/80 dark:prose-li:text-zinc-300
            prose-ul:space-y-1
            prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
            prose-hr:border-zinc-200 dark:prose-hr:border-white/10
            prose-blockquote:border-primary-500 prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:rounded-r-xl prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-foreground/80 dark:prose-blockquote:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* CTA interna */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 sm:p-8 rounded-2xl my-16 shadow-sm">
          <h3 className="text-foreground dark:text-white font-bold text-xl mb-3">¿Necesitas ayuda para reducir tu factura?</h3>
          <p className="text-foreground/70 dark:text-zinc-400 text-base mb-6">
            En Webtense Energy analizamos tu contrato de luz de forma gratuita y te decimos exactamente cuánto podrías ahorrar.
          </p>
          <Link
            href="/estudio"
            className="inline-flex items-center bg-primary-600 dark:bg-primary-500 text-white font-bold px-6 py-3 rounded-full hover:bg-primary-500 dark:hover:bg-primary-400 transition-colors shadow-lg shadow-primary-600/20 active:scale-95"
          >
            Solicitar estudio gratuito →
          </Link>
        </div>

        {/* Navegación */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-foreground/60 dark:text-zinc-400 hover:text-foreground dark:hover:text-white transition-colors font-medium gap-2"
          >
            ← Volver al blog
          </Link>
          <Link
            href="/contacto"
            className="text-foreground/50 dark:text-zinc-500 hover:text-foreground/80 dark:hover:text-zinc-300 text-sm transition-colors"
          >
            ¿Dudas? Contáctanos
          </Link>
        </div>
      </div>
    </article>
  );
}
