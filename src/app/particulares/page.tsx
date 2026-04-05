import Link from "next/link";

export default function ParticularesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-zinc-50 dark:bg-zinc-900 py-20 sm:py-24 border-b border-zinc-200 dark:border-white/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight">Eficiencia para tu Hogar</h1>
          <p className="text-lg md:text-xl text-foreground/70 dark:text-zinc-400 mb-8 leading-relaxed">
            Consigue la máxima eficiencia en tu vivienda. Te ayudamos a optimizar tu tarifa, incorporar energía solar y aprovechar la domótica para ahorrar mes a mes.
          </p>
          <button className="bg-primary-600 dark:bg-primary-500 text-white font-bold px-8 py-4 rounded-full hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary-600/20">
            Analizar mi Factura
          </button>
        </div>
      </section>

      <section className="py-20 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Tarifa / Luz */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 hover:border-primary-500 dark:hover:border-primary-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-primary-600/5">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Optimización de Tarifa</h2>
            <p className="text-foreground/70 dark:text-zinc-400 mb-6">Análisis detallado de tu consumo para recomendarte la mejor tarifa del mercado y ajustar tu potencia contratada.</p>
            <ul className="space-y-4 text-foreground/80 dark:text-zinc-300 mb-8 font-medium">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs">✓</span>
                Análisis de curvas de carga
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs">✓</span>
                Ajuste de potencia por tramos
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs">✓</span>
                Comparativa mensual
              </li>
            </ul>
            <button className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-500 transition-colors inline-flex items-center gap-2">Ver más detalles <span aria-hidden="true">→</span></button>
          </div>

          {/* Autoconsumo */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 hover:border-amber-500 dark:hover:border-amber-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-amber-500/5">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Autoconsumo y Solar</h2>
            <p className="text-foreground/70 dark:text-zinc-400 mb-6">Independencia energética mediante paneles solares y baterías. Descubre subvenciones y rentabilidad en tu tejado.</p>
            <ul className="space-y-4 text-foreground/80 dark:text-zinc-300 mb-8 font-medium">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">✓</span>
                Estudios de tejado
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">✓</span>
                Baterías físicas o virtuales
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">✓</span>
                Subvenciones y ayudas
              </li>
            </ul>
            <button className="text-amber-600 dark:text-amber-400 font-bold hover:text-amber-500 transition-colors inline-flex items-center gap-2">Ver más detalles <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </section>
    </div>
  );
}
