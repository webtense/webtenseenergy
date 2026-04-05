"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { allPosts, getAllCategories, formatDate } from "@/lib/posts";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const categories = getAllCategories();

  const filtered = activeCategory === "Todos"
    ? allPosts
    : allPosts.filter((p) => p.categories.includes(activeCategory));

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background">
      {/* Hero Blog Premium */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-transparent">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 dark:opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-4xl max-h-4xl bg-primary-100 dark:bg-primary-900/30 blur-[100px] dark:blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center mt-8">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em] shadow-sm dark:shadow-lg">
            Nuestros Artículos
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
            Conocimiento e <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-brand-600 dark:from-primary-400 dark:to-brand-400">Innovación</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/70 dark:text-zinc-400 leading-relaxed font-light mb-8">
            Guías estratégicas, comparativas de domótica y productos Amazon recomendados para revolucionar la eficiencia energética de tu hogar y empresa.
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 dark:text-zinc-500 bg-white dark:bg-zinc-900/50 px-6 py-3 rounded-full border border-zinc-200 dark:border-white/5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            {allPosts.length} artículos publicados
          </div>
        </div>
      </section>

      {/* Filtro por categoría estilo Pills Modern */}
      <section className="container mx-auto px-4 py-6 sm:py-12 sticky top-16 z-30 pt-8 pb-8 backdrop-blur-xl bg-background/80 border-b border-zinc-200 dark:border-white/5">
        <div className="flex flex-row flex-nowrap md:flex-wrap overflow-x-auto items-center md:justify-center gap-3 pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => {
            const isAct = activeCategory === cat;
            const count = allPosts.filter((p) => p.categories.includes(cat)).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  isAct
                    ? "bg-primary-600 dark:bg-primary-500 text-white dark:text-[#020610] shadow-lg dark:shadow-[0_0_20px_rgba(26,183,117,0.4)] scale-105"
                    : "bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-foreground/60 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white"
                }`}
              >
                {cat}
                {cat !== "Todos" && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isAct ? 'bg-black/20 dark:bg-[#020610]/20 text-white dark:text-inherit' : 'bg-zinc-100 dark:bg-white/10'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Grid de artículos vibrante */}
      <section className="container mx-auto px-4 mt-12">
        {filtered.length === 0 ? (
          <div className="text-center bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl py-20 backdrop-blur-md shadow-sm">
             <span className="text-6xl mb-4 block">🏜️</span>
            <h3 className="text-2xl font-bold text-foreground mb-2">Sin resultados</h3>
            <p className="text-foreground/60 dark:text-zinc-500">No hay artículos en esta categoría todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {filtered.map((post) => (
              <ArticleCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                date={formatDate(post.date)}
                slug={post.slug}
                featuredImage={post.featuredImage}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
