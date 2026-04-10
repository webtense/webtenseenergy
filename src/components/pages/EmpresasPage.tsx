import Link from "next/link";
import { withBasePath } from "@/lib/paths";

type EmpresasPageProps = {
  basePath: string;
};

export function EmpresasPage({ basePath }: EmpresasPageProps) {
  const servicios = [
    {
      title: "Optimización de Contratos",
      desc: "Negociación directa con comercializadoras de luz y gas para obtener las tarifas más ventajosas del mercado industrial y B2B.",
      icon: "📑",
      color: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/20",
    },
    {
      title: "Gestión Energética",
      desc: "Análisis y monitoreo mensual de consumos. Vigilamos tus facturas para evitar recargos imprevistos.",
      icon: "📊",
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
    },
    {
      title: "Reclamaciones",
      desc: "Gestión experta de disputas y reclamaciones ante compañías eléctricas y de gas.",
      icon: "⚖️",
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20",
    },
    {
      title: "Calidad de Suministro",
      desc: "Auditorías técnicas para solucionar cortes, caídas de tensión y penalizaciones por energía reactiva.",
      icon: "⚡",
      color: "from-yellow-400 to-orange-500",
      shadow: "shadow-yellow-500/20",
    },
    {
      title: "Proyectos Renovables",
      desc: "Estudios de viabilidad e implementación de Fotovoltaica y Aerotermia para grandes consumos.",
      icon: "☀️",
      color: "from-amber-400 to-yellow-500",
      shadow: "shadow-amber-500/20",
    },
    {
      title: "Auditoría Energética",
      desc: "Revisión completa de instalaciones para asegurar cumplimiento normativo y maximizar la eficiencia.",
      icon: "🔍",
      color: "from-cyan-400 to-blue-500",
      shadow: "shadow-cyan-500/20",
    },
  ];

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Refinado y Premium */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-zinc-50 dark:bg-transparent border-b border-zinc-200 dark:border-white/5">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary-100 dark:bg-primary-900/20 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-100 dark:bg-brand-900/20 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
          <div className="inline-block px-5 py-2 mb-8 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-2xl">
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-brand-600 dark:from-primary-400 dark:to-brand-400 uppercase tracking-widest">
              Consultoría Energética B2B
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground mb-8 tracking-tight">
            Energía bajo control para <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 drop-shadow-sm">
              tu Empresa
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-foreground/70 dark:text-zinc-300/80 mb-12 leading-relaxed font-light">
            Soluciones de alto impacto para reducir el coste operativo. Aplicamos inteligencia de datos y estrategias de compra en el mercado eléctrico para industria, hoteles y retail.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href={withBasePath(basePath, "/contacto")}
              className="relative group overflow-hidden rounded-full px-10 py-5 font-bold text-white transition-all shadow-[0_0_30px_rgba(26,183,117,0.3)] bg-primary-600 dark:bg-primary-500 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 transition-opacity group-hover:opacity-80"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Solicitar Diagnóstico
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </span>
            </Link>
            <Link
              href="#servicios"
              className="group rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm backdrop-blur-sm px-10 py-5 font-bold text-foreground hover:bg-zinc-50 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all w-full sm:w-auto"
            >
              Descubrir Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Métricas con diseño Glassmorphism */}
      <section className="relative z-20 -mt-10 mb-20 container mx-auto px-4">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row justify-around items-center gap-12 text-center md:divide-x md:divide-zinc-200 md:dark:divide-white/10">
            <div className="w-full">
              <div className="text-5xl font-extrabold text-foreground mb-2 tracking-tighter shadow-sm">
                <span className="text-primary-600 dark:text-primary-400">12-18</span>%
              </div>
              <div className="text-sm font-bold text-foreground/60 dark:text-zinc-500 uppercase tracking-widest mt-3">Ahorro Promedio</div>
            </div>
            <div className="w-full">
              <div className="text-5xl font-extrabold text-foreground mb-2 tracking-tighter">
                <span className="text-brand-600 dark:text-brand-400">+50</span>M
              </div>
              <div className="text-sm font-bold text-foreground/60 dark:text-zinc-500 uppercase tracking-widest mt-3">kWh Gestionados</div>
            </div>
            <div className="w-full">
              <div className="text-5xl font-extrabold text-foreground mb-2 tracking-tighter">
                <span className="text-emerald-600 dark:text-emerald-400">100</span>%
              </div>
              <div className="text-sm font-bold text-foreground/60 dark:text-zinc-500 uppercase tracking-widest mt-3">Acompañamiento</div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Premium con Hover Effects */}
      <section id="servicios" className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-foreground">Nuestros Servicios B2B</h2>
            <p className="text-foreground/70 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Soluciones integrales diseñadas estratégicamente para la optimización y transición energética de las empresas más exigentes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((s) => (
              <div key={s.title} className="group relative bg-white dark:bg-[#0a0f1c] border border-zinc-200 dark:border-white/5 rounded-3xl p-10 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                {/* Iluminación de fondo en hover */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${s.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full`}></div>

                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${s.color} bg-opacity-10 flex items-center justify-center text-4xl mb-8 shadow-lg ${s.shadow} transform group-hover:scale-110 transition-transform duration-300 border border-zinc-100 dark:border-white/10`}>
                  <div className="bg-white dark:bg-[#0a0f1c] absolute inset-[2px] rounded-[14px]"></div>
                  <span className="relative z-10">{s.icon}</span>
                </div>

                <h3 className="text-2xl font-bold font-heading mb-4 text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-foreground/70 dark:text-zinc-400 leading-relaxed font-light relative z-10">{s.desc}</p>

                <div className="mt-8 flex items-center text-sm font-bold text-foreground/40 dark:text-white/50 group-hover:text-primary-600 dark:group-hover:text-white transition-colors cursor-pointer">
                  Saber más <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final con diseño vibrante */}
      <section className="relative overflow-hidden py-32 mt-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-brand-800 dark:from-primary-900 dark:to-brand-900"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>

        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-500/40 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-brand-500/40 blur-[120px] rounded-full -translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Deja de pagar de más por tu energía</h2>
          <p className="text-white/80 mb-12 text-xl max-w-2xl mx-auto font-light">
            Sube tu factura, nuestro equipo la analiza con tecnología propia, y te entregamos una propuesta clara de mejora en 48 horas. Sin compromiso.
          </p>
          <Link
            href={withBasePath(basePath, "/estudio")}
            className="inline-block bg-white text-primary-950 font-bold px-12 py-5 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all text-lg"
          >
            Empezar Análisis Gratuito
          </Link>
        </div>
      </section>
    </div>
  );
}
