import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import { SectionHero } from '@/components/shared/SectionHero';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { MetricPill } from '@/components/shared/MetricPill';
import { ActionBanner } from '@/components/shared/ActionBanner';

type HomePageProps = {
  locale: 'ES' | 'CA';
  basePath: string;
};

export async function HomePage({ basePath }: HomePageProps) {
  const problems = [
    {
      title: 'Potencia contratada incorrecta',
      desc: 'Pagas por capacidad que no usas o acumulas penalizaciones por excederla. Ambas situaciones se corrigen sin obras.',
    },
    {
      title: 'Consumo sin gestión horaria',
      desc: 'Los equipos funcionan cuando la electricidad es más cara. No por decisión, sino por falta de configuración.',
    },
    {
      title: 'Sin datos, sin control',
      desc: 'Sin monitorización no hay gestión real. Se trabaja con estimaciones y se paga el precio de la incertidumbre.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Análisis previo',
      desc: 'Envíanos tus últimas 3 facturas. En 48 horas te decimos si hay margen de mejora y cuánto. Sin coste ni compromiso.',
    },
    {
      num: '02',
      title: 'Auditoría técnica',
      desc: 'Visita a tu instalación. Analizamos consumo real sin interferir en tu operativa. Informe con ahorro estimado y plan priorizado.',
    },
    {
      num: '03',
      title: 'Implementación y seguimiento',
      desc: 'Ejecutamos las medidas acordadas. Cada mes recibes un informe con el ahorro real generado, no proyectado.',
    },
  ];

  const sectors = [
    { label: 'Hoteles y alojamiento', icon: '▣' },
    { label: 'Restauración organizada', icon: '◈' },
    { label: 'Industria ligera', icon: '◧' },
    { label: 'Retail y logística', icon: '◫' },
  ];

  return (
    <div className="flex flex-col bg-background">
      {/* HERO */}
      <SectionHero
        eyebrow="Consultoría energética B2B"
        title="Reduce hasta un 45% el coste energético de tu negocio"
        subtitle="Para hoteles, restauración y empresas con facturas superiores a 3.000 €/mes. Sin obras. Sin cambiar de suministrador. Con resultados medibles en menos de 90 días, según tipología de negocio."
        actions={
          <>
            <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
              Solicitar análisis energético
            </Link>
            <Link href={withBasePath(basePath, '/empresas')} className="cta-secondary">
              Ver cómo funciona
            </Link>
          </>
        }
        aside={
          <div className="surface-panel overflow-hidden p-4">
            <div className="grid gap-4">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#06111d] p-5 text-white">
                <div className="absolute inset-0 opacity-80">
                  <Image
                    src="/images/hero_home.png"
                    alt="Webtense Energy"
                    fill
                    className="object-cover mix-blend-luminosity opacity-30"
                  />
                </div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-300">
                      Ahorro certificado
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">22–38%</p>
                    <p className="mt-1 text-sm text-white/70">
                      Ahorro medio en clientes activos según tipología de negocio.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricPill label="Análisis" value="48h" />
                    <MetricPill label="Retorno" value="4–7 meses" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* CHIPS */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="flex flex-wrap gap-3">
            <div className="metric-chip">
              <span className="h-2 w-2 rounded-full bg-primary-500"></span>Análisis gratuito en 48h
            </div>
            <div className="metric-chip">
              <span className="h-2 w-2 rounded-full bg-brand-500"></span>Solo negocios +3.000 €/mes
            </div>
            <div className="metric-chip">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>Resultados medibles en 90
              días
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="section-shell">
        <div className="section-inner">
          <SectionIntro
            eyebrow="El problema real"
            title="Tu factura no es cara. Es ineficiente."
            description="La mayoría de negocios paga entre un 20% y un 40% más de lo que debería. No por mala suerte, sino por tres razones concretas que se repiten en casi todos los casos que auditamos."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {problems.map((p) => (
              <div key={p.title} className="surface-panel-soft p-7">
                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Método"
            title="Tres pasos. Sin interrumpir tu operativa."
            description="Auditamos, implementamos y medimos. Cada mes recibes los resultados reales, no estimaciones."
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="surface-panel-soft p-7">
                <p className="font-heading text-5xl font-bold text-primary-100 dark:text-primary-900/40">
                  {s.num}
                </p>
                <h3 className="mt-4 font-heading text-xl font-bold tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASO REAL + TESTIMONIO */}
      <section className="section-shell">
        <div className="section-inner grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="surface-panel-soft p-8 md:p-10">
            <p className="eyebrow">Caso real</p>
            <h2 className="section-title mt-5 text-foreground">
              Hotel 4★ en Costa Brava: de 18.400 € a 11.200 € al mes
            </h2>
            <p className="section-copy mt-4">
              Potencias mal ajustadas, climatización sin control de ocupación y cero visibilidad por
              zonas. En 90 días: ahorro certificado de <strong>86.400 € anuales</strong>. Retorno de
              inversión en 4,2 meses.
            </p>
            <Link
              href={withBasePath(basePath, '/caso-real')}
              className="mt-8 inline-block text-sm font-semibold text-primary-600 dark:text-primary-300"
            >
              Leer el caso completo →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                quote:
                  'Lo que más me sorprendió no fue el ahorro. Fue ver por primera vez exactamente dónde se iba el dinero.',
                author: 'Director de operaciones',
                role: 'Hotel 4★, Costa Brava',
              },
              {
                quote:
                  'El informe fue suficiente para justificar la inversión ante el consejo. Eso es exactamente lo que necesitábamos.',
                author: 'Gerente financiero',
                role: 'Hotel 4★, 95 habitaciones',
              },
            ].map((t) => (
              <blockquote key={t.author} className="surface-panel-soft p-6">
                <p className="text-sm leading-7 text-foreground/75 italic">"{t.quote}"</p>
                <footer className="mt-4">
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-foreground/50">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORES */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Sectores"
            title="Para negocios con consumo energético real"
            description="No trabajamos con particulares ni con consumos residenciales. Nuestro foco son instalaciones donde el ahorro tiene impacto directo en el margen operativo."
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((s) => (
              <div
                key={s.label}
                className="surface-panel-soft flex items-center gap-4 p-5 text-sm font-semibold text-foreground"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-lg text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {s.icon}
                </span>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="¿Hay margen en tu negocio? En 48 horas te lo decimos."
            description="Envíanos tus últimas 3 facturas eléctricas. Sin visita previa. Sin compromiso. Si no hay margen real, te lo decimos también."
            action={
              <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
                Solicitar análisis — solo negocios +3.000 €/mes
              </Link>
            }
          />
        </div>
      </section>
    </div>
  );
}
