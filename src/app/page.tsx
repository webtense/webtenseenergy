import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        <Image
          src="/images/hero_home.png"
          alt="Transición energética para hogares y empresas"
          fill
          className="object-cover brightness-50 dark:brightness-40"
          priority
        />
        <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Eficiencia y control para <span className="text-primary-400">tu negocio y hogar</span>
            </h1>
            <p className="max-w-xl text-base sm:text-lg text-zinc-100 sm:text-xl leading-relaxed">
              Soluciones energéticas personalizadas. Desde auditorías y reducción de costes B2B, hasta domótica avanzada y ahorro para particulares.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Link
                href="/empresas"
                className="inline-flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 px-8 py-4 text-base font-bold text-white transition-all hover:bg-primary-500 dark:hover:bg-primary-400 hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary-600/20"
              >
                Servicios para Empresas
              </Link>
              <Link
                href="/estudio"
                className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/20 active:scale-95"
              >
                Estudio de Factura Gratuito
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Main Pillars */}
      <section className="container mx-auto px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl text-foreground">¿Cómo podemos ayudarte?</h2>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-primary-500" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Consultoría B2B",
              desc: "Reducimos costes y riesgos en electricidad y gas con datos, contratos correctos y seguimiento mensual.",
              link: "/empresas",
              color: "bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400",
              icon: "🏢"
            },
            {
              title: "Ahorro Doméstico",
              desc: "Optimiza tu tarifa, instala paneles solares y reduce tu factura de luz de forma inteligente.",
              link: "/particulares",
              color: "bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400",
              icon: "🏠"
            },
            {
              title: "Domótica & Amazon",
              desc: "Descubre los mejores productos y guías para automatizar tu vida y hacer tu entorno más eficiente.",
              link: "/blog",
              color: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
              icon: "⚡"
            }
          ].map((cat, i) => (
            <Link 
              key={i} 
              href={cat.link}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/10 dark:border-white/5 dark:bg-zinc-900/50 dark:hover:border-primary-500/30 dark:hover:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-background"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-foreground/70 dark:text-foreground/60 leading-relaxed">
                {cat.desc}
              </p>
              <div className="mt-6 flex items-center text-sm font-bold text-primary-600 dark:text-primary-500">
                Ver más <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Deals Teaser */}
      <section className="bg-zinc-50 dark:bg-zinc-900 py-20 sm:py-24 border-t border-zinc-200 dark:border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">No te pierdas los Chollos en Energía</h2>
              <p className="mt-4 text-foreground/70 dark:text-zinc-400 text-lg">
                Monitorizamos precios en tiempo real de los mejores componentes para tu instalación solar y gadgets de domótica.
              </p>
            </div>
            <Link
              href="/ofertas"
              className="inline-flex h-14 items-center justify-center rounded-full bg-brand-600 px-8 sm:px-10 text-base font-bold text-white transition-all hover:bg-brand-500 hover:shadow-2xl hover:shadow-brand-600/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              Canal de Ofertas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
