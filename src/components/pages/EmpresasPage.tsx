import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import { SectionHero } from '@/components/shared/SectionHero';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { MetricPill } from '@/components/shared/MetricPill';
import { ActionBanner } from '@/components/shared/ActionBanner';

type EmpresasPageProps = {
  basePath: string;
};

export function EmpresasPage({ basePath }: EmpresasPageProps) {
  const pains = [
    'Contratos que llevan años sin revisarse. Pagas excesos de potencia recurrentes que nadie ha identificado.',
    'Equipos consumiendo a plena potencia en horarios de precio máximo. Sin configuración, sin ahorro.',
    'Sin datos de consumo por zonas. El mantenimiento se gestiona por estimación, no por realidad.',
  ];

  const services = [
    {
      title: 'Auditoría Energética',
      desc: 'Análisis completo de instalación, contrato, tarifas y penalizaciones. Informe ejecutivo con cada medida priorizada por impacto económico y plazo de retorno.',
      meta: 'Plazo: 5–10 días laborables',
      icon: '◧',
    },
    {
      title: 'Optimización Tarifaria',
      desc: 'Revisión de potencias contratadas, discriminación horaria y condiciones tarifarias. En muchos casos genera ahorro inmediato sin ninguna inversión técnica.',
      meta: 'Resultado típico: 10–20% inmediato',
      icon: '◈',
    },
    {
      title: 'Automatización Energética',
      desc: 'Climatización, iluminación y maquinaria gestionadas según ocupación real y precio horario. Reducción sistemática sin impacto en el servicio.',
      meta: 'Resultado típico: 25–40% en sistemas intervenidos',
      icon: '▣',
    },
    {
      title: 'Monitorización Continua',
      desc: 'Panel de control con consumo en tiempo real. Alertas automáticas ante anomalías. Informe mensual con ahorro certificado, no estimado.',
      meta: 'Disponible para clientes con implementación activa',
      icon: '◫',
    },
    {
      title: 'Autoconsumo Solar Industrial',
      desc: 'Para negocios con consumo superior a 50.000 kWh/año. Estudio, tramitación de licencias e instalación completa con foco en retorno real.',
      meta: 'ROI documentado: 4–6 años',
      icon: '☀',
    },
  ];

  const process = [
    {
      num: '01',
      title: 'Análisis previo gratuito',
      desc: 'Nos envías tus últimas 3 facturas. En 48 horas te decimos si hay margen real y cuánto puedes esperar ahorrar. Sin coste ni compromiso.',
    },
    {
      num: '02',
      title: 'Auditoría técnica in situ',
      desc: 'Visita a tu instalación. Medición de consumos reales sin interferir en tu operativa. Entrega de informe con plan de acción priorizado.',
    },
    {
      num: '03',
      title: 'Implementación y seguimiento',
      desc: 'Ejecutamos las medidas acordadas. Cada mes recibes un informe con el ahorro real generado. No proyectado. Certificado.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Llevábamos años con el mismo contrato. En dos semanas detectaron excesos de potencia que nos costaban 800 euros al mes. Nadie lo había visto antes.',
      author: 'Director de operaciones',
      role: 'Cadena de restauración, 6 locales',
    },
    {
      quote:
        'El informe fue suficiente para justificar la inversión ante el consejo. Eso es exactamente lo que necesitábamos.',
      author: 'Gerente financiero',
      role: 'Hotel 4★, 95 habitaciones',
    },
    {
      quote:
        'En 90 días redujimos la factura un 31%. Ahora tenemos datos reales y sabemos exactamente qué está pasando en cada zona.',
      author: 'Responsable de mantenimiento',
      role: 'Resort, Costa Brava',
    },
  ];

  return (
    <div className="flex flex-col bg-background">
      {/* HERO */}
      <SectionHero
        eyebrow="Consultoría energética B2B"
        title={
          <>
            Tu consumo energético es un coste fijo.{' '}
            <span className="text-primary-600 dark:text-primary-300">Puede dejar de serlo.</span>
          </>
        }
        subtitle="Para directores de operaciones, gerentes y responsables financieros con facturas superiores a 3.000 €/mes. No necesitas obras. No necesitas cambiar de suministrador. Necesitas datos y alguien que sepa qué hacer con ellos."
        actions={
          <>
            <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
              Solicitar análisis — solo negocios +3.000 €/mes
            </Link>
            <Link href={withBasePath(basePath, '/caso-real')} className="cta-secondary">
              Ver caso real
            </Link>
          </>
        }
        aside={
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricPill label="Ahorro medio certificado" value="22–38%" />
            <MetricPill label="Retorno de inversión" value="4–7 meses" />
            <MetricPill label="Análisis previo" value="48h / gratis" />
          </div>
        }
      />

      {/* PROBLEMA */}
      <section className="section-shell">
        <div className="section-inner grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionIntro
            eyebrow="El problema real"
            title="El gasto energético se paga. Rara vez se gestiona."
            description="En la mayoría de negocios con los que trabajamos, el punto de partida es el mismo: la factura llega, se aprueba, se paga. Sin cuestionarla. Sin analizarla."
          />
          <div className="grid gap-4">
            {pains.map((pain) => (
              <div
                key={pain}
                className="surface-panel-soft p-6 text-sm leading-7 text-foreground/75"
              >
                {pain}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Servicios"
            title="No asesoramiento. Resultados con número."
            description="Antes de cobrar nada, te decimos exactamente cuánto puedes ahorrar y en qué plazo recuperas la inversión. Si los números no cuadran, no seguimos."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="surface-panel-soft flex flex-col p-7 transition hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-500/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  {service.icon}
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-foreground/70">{service.desc}</p>
                <p className="mt-4 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {service.meta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="section-shell">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Método"
            title="Tres pasos. Sin riesgo."
            description="El proceso completo no requiere paralizar ni modificar tu operativa. Trabajamos con tus datos, no con simulaciones."
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {process.map((s) => (
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

      {/* TESTIMONIOS */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Lo que dicen los clientes"
            title="Negocios reales. Resultados documentados."
            description="No publicamos nombres por acuerdo de confidencialidad. Sí publicamos lo que dicen las personas que gestionan estos negocios."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.author} className="surface-panel-soft p-7">
                <p className="text-sm leading-7 text-foreground/75 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-zinc-200/60 pt-4 dark:border-white/10">
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-foreground/50">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="El análisis previo es gratuito y no compromete nada."
            description="Envíanos tus últimas 3 facturas eléctricas. En 48 horas te decimos si hay margen y cuánto puedes esperar ahorrar. Si no hay margen real, te lo decimos también."
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
