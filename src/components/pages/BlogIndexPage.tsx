'use client';

import { useState, useEffect } from 'react';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { formatDate, getAllCategories, type BlogListItem } from '@/lib/blog-shared';
import { SectionHero } from '@/components/shared/SectionHero';
import { SectionIntro } from '@/components/shared/SectionIntro';

type BlogIndexPageProps = {
  basePath: string;
  posts: BlogListItem[];
};

export function BlogIndexPage({ basePath, posts }: BlogIndexPageProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [blogEnabled, setBlogEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/public/feature-flags')
      .then((res) => res.json())
      .then((data) => setBlogEnabled(data.blog !== false))
      .catch(() => {});
  }, []);

  const categories = getAllCategories(posts);
  const featured = posts.slice(0, 3);
  const filtered =
    activeCategory === 'Todos' ? posts : posts.filter((p) => p.categories.includes(activeCategory));

  if (!blogEnabled) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Sección en mantenimiento</h1>
          <p className="text-foreground/60">Vuelve pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <SectionHero
        eyebrow="Centro de conocimiento"
        title={
          <>
            Conocimiento para decidir{' '}
            <span className="text-primary-600 dark:text-primary-300">mejor</span>
          </>
        }
        subtitle="Guías prácticas, comparativas de domótica, herramientas y contexto para entender la energía sin lenguaje opaco."
        align="center"
        compact
      />

      <section className="section-shell-tight">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Destacados"
            title="Empieza por las piezas que mejor explican el producto"
            align="center"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {featured[0] ? (
              <ArticleCard
                title={featured[0].title}
                excerpt={featured[0].excerpt}
                category={featured[0].category}
                date={formatDate(featured[0].date)}
                slug={featured[0].slug}
                featuredImage={featured[0].featuredImage}
                basePath={basePath}
              />
            ) : null}
            <div className="grid gap-6">
              {featured.slice(1).map((post) => (
                <ArticleCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={formatDate(post.date)}
                  slug={post.slug}
                  featuredImage={post.featuredImage}
                  basePath={basePath}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell-tight border-y border-zinc-200/80 bg-zinc-50/80 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="section-inner">
          <div className="flex flex-row flex-nowrap items-center gap-3 overflow-x-auto pb-1 scrollbar-hide md:flex-wrap md:justify-center">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = posts.filter((p) => p.categories.includes(cat)).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                      : 'border border-zinc-200 bg-white text-foreground/65 hover:border-primary-300 hover:text-primary-700 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-500/20'
                  }`}
                >
                  {cat}
                  {cat !== 'Todos' ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? 'bg-black/15 text-white' : 'bg-zinc-100 dark:bg-white/10'}`}
                    >
                      {count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner">
          {filtered.length === 0 ? (
            <div className="surface-panel-soft py-20 text-center">
              <span className="block text-5xl">🏜️</span>
              <h3 className="mt-5 text-2xl font-bold text-foreground">Sin resultados</h3>
              <p className="mt-2 text-sm text-foreground/60">
                No hay artículos en esta categoría todavía.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((post) => (
                <ArticleCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={formatDate(post.date)}
                  slug={post.slug}
                  featuredImage={post.featuredImage}
                  basePath={basePath}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
