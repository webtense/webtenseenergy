import Link from "next/link";
import Image from "next/image";

// Colores por categoría más vibrantes para el nuevo diseño premium
const CATEGORY_COLORS: Record<string, { bg: string, text: string, border: string, glow: string }> = {
  "Domótica": { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
  "Ahorro Energético": { bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]" },
  "Ofertas": { bg: "bg-orange-100 dark:bg-orange-500/10", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]" },
  "Reseñas": { bg: "bg-purple-100 dark:bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
  "Gestión Energética": { bg: "bg-yellow-100 dark:bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]" },
};

const DEFAULT_COLOR = { bg: "bg-zinc-100 dark:bg-zinc-500/10", text: "text-zinc-700 dark:text-zinc-400", border: "border-zinc-200 dark:border-zinc-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(161,161,170,0.15)]" };

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  featuredImage?: string | null;
}

export function ArticleCard({ title, excerpt, category, date, slug, featuredImage }: ArticleCardProps) {
  const colors = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

  // Icono aleatorio según categoría usando las nuevas especificaciones de color
  const renderIcon = () => {
    switch (category) {
      case "Domótica": return "🏠";
      case "Ofertas": return "🔥";
      case "Ahorro Energético": return "⚡";
      case "Gestión Energética": return "📊";
      default: return "📖";
    }
  };

  return (
    <Link
      href={`/blog/${slug}`}
      className={`group flex flex-col justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full relative shadow-sm hover:shadow-lg ${colors.glow}`}
    >
      {/* Efecto Glow Superior */}
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.bg.replace('/10', '/50')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      
      {/* Imagen destacada o Icono Placeholder */}
      <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-[#030712]">
        {featuredImage && !featuredImage.startsWith('/images/blog-placeholder') ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-[#0a0f1c]">
            <div className={`w-32 h-32 rounded-full ${colors.bg} flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-zinc-200 dark:border-white/5`}>
               <span className="text-5xl drop-shadow-lg">{renderIcon()}</span>
            </div>
          </div>
        )}
        
        {/* Etiqueta flotante */}
        <div className="absolute top-4 left-4 z-20">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border ${colors.bg.replace('bg-', 'bg-').replace('/10', '/80')} ${colors.text} ${colors.border}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8 flex flex-col flex-1 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-foreground/60 dark:text-zinc-500 text-sm font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {date}
          </span>
        </div>
        <h3 className="font-heading text-2xl font-bold text-foreground mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-foreground/70 dark:text-zinc-400 text-base leading-relaxed mb-8 line-clamp-3 font-light">
          {excerpt}
        </p>
        <div className={`font-bold text-sm flex items-center mt-auto ${colors.text}`}>
          Leer artículo 
          <span className="ml-2 w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:bg-current group-hover:text-white dark:group-hover:text-[#0a0f1c] transition-all group-hover:ml-3">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
