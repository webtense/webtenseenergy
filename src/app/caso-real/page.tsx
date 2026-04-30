import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';
import { ActionBanner } from '@/components/shared/ActionBanner';

export const metadata = buildPageMetadata({
  title: 'Caso Real: Hotel 4★ Costa Brava — 86.400 € de ahorro anual | Webtense Energy',
  description:
    'De 18.400 € a 11.200 € de factura mensual en 90 días. Caso real documentado de auditoría energética en hotel independiente en Costa Brava.',
  path: '/caso-real',
  locale: 'root',
});

const results = [
  { label: 'Factura antes', value: '18.400 €/mes' },
  { label: 'Factura después', value: '11.200 €/mes' },
  { label: 'Ahorro anual', value: '86.400 €' },
  { label: 'Inversión total', value: '28.500 €' },
  { label: 'Retorno', value: '4,2 meses' },
  { label: 'Reducción', value: '–39%' },
];

const findings = [
  {
    title: 'Excesos de potencia sistemáticos',
    desc: 'La potencia contratada en el periodo P1 estaba por debajo del consumo real en temporada alta. Resultado: penalizaciones recurrentes que nadie había correlacionado con la tarifa.',
    saving: '680 €/mes eliminados',
  },
  {
    title: 'Climatización sin gestión de ocupación',
    desc: 'El sistema funcionaba por horario fijo, independientemente de si las zonas estaban ocupadas. En temporada baja, áreas vacías climatizadas al mismo nivel que en agosto.',
    saving: '–34% en consumo HVAC',
  },
  {
    title: 'Cero visibilidad por zonas',
    desc: 'Restaurante, spa, habitaciones y zonas comunes compartían contador. Imposible identificar anomalías ni gestionar por prioridad. El mantenimiento se hacía por estimación.',
    saving: 'Control total activado',
  },
];

const timeline = [
  {
    period: 'Semana 1–2',
    action:
      'Ajuste de potencias contratadas en todos los periodos. Sin inversión, solo gestión contractual. Ahorro visible en la siguiente factura.',
  },
  {
    period: 'Semana 3–4',
    action:
      'Instalación de sistema de monitorización por zonas. Primeros datos reales. Identificación de anomalía en el compresor del spa.',
  },
  {
    period: 'Mes 2',
    action:
      'Automatización de climatización vinculada a datos de ocupación del PMS del hotel. Configuración de perfiles por temporada y tipo de zona.',
  },
  {
    period: 'Mes 3',
    action:
      'Ajuste fino basado en datos reales de los dos meses anteriores. Activación de alertas automáticas para el equipo de mantenimiento.',
  },
];

export default function CasoRealPage() {
  return (
    <div className="flex flex-col bg-background">
      {/* HEADER */}
      <section className="section-shell bg-[#06111d] text-white">
        <div className="section-inner">
          <p className="eyebrow text-primary-300">Caso real documentado</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight lg:text-5xl">
            Hotel independiente 4★ — Costa Brava
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            82 habitaciones. Factura mensual media de 18.400 €. En 90 días: ahorro certificado de{' '}
            <strong className="text-white">86.400 € anuales</strong> con un retorno de inversión de
            4,2 meses.
          </p>
          <p className="mt-4 text-sm text-white/40">
            Datos validados por el cliente. Nombre no publicado por acuerdo de confidencialidad.
          </p>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <div key={r.label} className="surface-panel-soft p-6 text-center">
                <p className="text-3xl font-bold tracking-tight text-foreground">{r.value}</p>
                <p className="mt-2 text-sm text-foreground/50">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SITUACIÓN INICIAL */}
      <section className="section-shell">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Situación inicial</p>
            <h2 className="section-title mt-3 text-foreground">Qué encontramos</h2>
            <p className="section-copy mt-4 max-w-2xl">
              El director de operaciones había notado que la factura subió un 22% en dos años sin
              que el consumo ni la ocupación lo justificaran. Nadie tenía tiempo ni herramientas
              para analizarla.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {findings.map((f) => (
              <div key={f.title} className="surface-panel-soft p-7">
                <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{f.desc}</p>
                <p className="mt-4 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {f.saving}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Ejecución</p>
            <h2 className="section-title mt-3 text-foreground">Qué hicimos y cuándo</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {timeline.map((t) => (
              <div key={t.period} className="surface-panel-soft p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                  {t.period}
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground/75">{t.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIO */}
      <section className="section-shell">
        <div className="section-inner">
          <blockquote className="surface-panel-soft mx-auto max-w-2xl p-10 text-center">
            <p className="text-xl leading-8 text-foreground/80 italic">
              "Lo que más me sorprendió no fue el ahorro. Fue ver por primera vez exactamente dónde
              se iba el dinero. Ahora tenemos control real sobre un coste que antes simplemente
              pagábamos."
            </p>
            <footer className="mt-8">
              <p className="font-semibold text-foreground">Director de operaciones</p>
              <p className="text-sm text-foreground/50">Hotel 4★, Costa Brava</p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="¿Tu negocio tiene un perfil similar?"
            description="Envíanos tus últimas 3 facturas. En 48 horas te decimos si hay margen y cuánto puedes esperar ahorrar. Sin visita previa. Sin compromiso."
            action={
              <Link href="/estudio" className="cta-primary">
                Solicitar análisis — solo negocios +3.000 €/mes
              </Link>
            }
          />
        </div>
      </section>
    </div>
  );
}
