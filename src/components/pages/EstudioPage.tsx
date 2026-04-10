import EnergyAuditWizard from "@/components/ui/EnergyAuditWizard";

export function EstudioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-16 lg:py-24 relative overflow-hidden border-b border-zinc-200 dark:border-white/5">
        <div className="absolute inset-0 bg-[url('/images/b2b-pattern.svg')] opacity-5 pointer-events-none"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 font-bold text-sm mb-4 border border-primary-200 dark:border-primary-500/20 shadow-sm">
            100% Gratuito y Sin Compromiso
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
            Optimiza tu <span className="text-primary-600 dark:text-primary-500">Factura de Luz</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-foreground/70 dark:text-zinc-400 leading-relaxed mb-10">
            Analizamos tu consumo y tus hábitos para ofrecerte la tarifa más barata del mercado. Sube tu factura o indícanos tu consumo y nosotros hacemos el resto.
          </p>
        </div>
      </section>

      {/* Wizard Section */}
      <section className="py-12 pb-24 container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-8 sm:-mt-10 lg:-mt-16">
        <EnergyAuditWizard />
      </section>

      {/* Ventajas / Info extra */}
      <section className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-white/5 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl text-foreground">¿Por qué analizar tu factura con nosotros?</h2>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-primary-600 dark:bg-primary-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-emerald-200 dark:border-transparent">💶</div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Ahorro Garantizado</h3>
              <p className="text-foreground/70 dark:text-zinc-400 leading-relaxed">
                Comparamos más de 30 comercializadoras para encontrar la que mejor se adapta a tus hábitos reales de consumo.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-blue-200 dark:border-transparent">⚡</div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Cero Papeleos</h3>
              <p className="text-foreground/70 dark:text-zinc-400 leading-relaxed">
                Nosotros nos encargamos de todo el proceso de cambio de compañía si decides aceptar nuestra recomendación.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-purple-200 dark:border-transparent">🔒</div>
              <h3 className="font-bold text-xl mb-3 text-foreground">100% Independientes</h3>
              <p className="text-foreground/70 dark:text-zinc-400 leading-relaxed">
                No trabajamos en exclusiva para ninguna distribuidora. Nuestro único objetivo es que tú pagues menos a fin de mes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
