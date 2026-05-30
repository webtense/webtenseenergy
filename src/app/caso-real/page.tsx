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

/* ------------------------------------------------------------------ */
/* Componente: Tabla comparativa Antes / Después                       */
/* ------------------------------------------------------------------ */
function TablaComparativa() {
  const rows = [
    {
      concepto: 'Factura mensual media',
      antes: '18.400 €',
      despues: '11.200 €',
      mejora: '–7.200 €/mes',
      positivo: true,
    },
    {
      concepto: 'Penalizaciones por potencia',
      antes: '680 €/mes',
      despues: '0 €/mes',
      mejora: '100% eliminadas',
      positivo: true,
    },
    {
      concepto: 'Consumo HVAC (climatización)',
      antes: 'Base 100%',
      despues: '66% del anterior',
      mejora: '–34% consumo',
      positivo: true,
    },
    {
      concepto: 'Visibilidad por zonas',
      antes: 'Ninguna',
      despues: 'Tiempo real',
      mejora: 'Control total',
      positivo: true,
    },
    {
      concepto: 'Tendencia factura (2 años previos)',
      antes: '+22% sin causa',
      despues: 'Estabilizada',
      mejora: 'Revertida',
      positivo: true,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-[color-mix(in_srgb,var(--foreground)_7%,transparent)]">
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              background: 'color-mix(in srgb, var(--background) 85%, var(--color-neutral-100) 15%)',
            }}
          >
            <th className="px-5 py-4 text-left font-semibold text-foreground/60 text-xs uppercase tracking-widest">
              Concepto
            </th>
            <th className="px-5 py-4 text-left font-semibold text-red-600 text-xs uppercase tracking-widest">
              Antes
            </th>
            <th className="px-5 py-4 text-left font-semibold text-primary-600 text-xs uppercase tracking-widest">
              Después
            </th>
            <th className="px-5 py-4 text-left font-semibold text-foreground/60 text-xs uppercase tracking-widest">
              Mejora
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.concepto}
              style={{
                background:
                  i % 2 === 0
                    ? 'color-mix(in srgb, var(--background) 100%, transparent)'
                    : 'color-mix(in srgb, var(--background) 96%, var(--color-neutral-100) 4%)',
                borderTop: '1px solid color-mix(in srgb, var(--foreground) 5%, transparent)',
              }}
            >
              <td className="px-5 py-4 font-medium text-foreground">{row.concepto}</td>
              <td className="px-5 py-4 text-red-600 font-mono font-semibold">{row.antes}</td>
              <td className="px-5 py-4 text-primary-600 font-mono font-semibold">{row.despues}</td>
              <td className="px-5 py-4">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: 'color-mix(in srgb, var(--color-primary-500) 12%, transparent)',
                    color: 'var(--color-primary-700)',
                  }}
                >
                  ✓ {row.mejora}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Componente: Barras visuales de ahorro                               */
/* ------------------------------------------------------------------ */
function BarrasAhorro() {
  // Factura antes = 18.400, después = 11.200
  // Porcentaje después respecto a antes: 11200/18400 = 60.87% → barra verde al 60.87%
  const anchoAntes = 100;
  const anchoDespues = Math.round((11200 / 18400) * 100); // 61

  return (
    <div className="space-y-5">
      {/* Barra ANTES */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground/70">Factura antes</span>
          <span className="text-sm font-bold text-red-600 font-mono">18.400 €/mes</span>
        </div>
        <div
          className="relative h-12 rounded-xl overflow-hidden"
          style={{
            background: 'color-mix(in srgb, var(--background) 90%, var(--color-neutral-100) 10%)',
          }}
        >
          <div
            className="h-full rounded-xl flex items-center justify-end pr-4"
            style={{
              width: `${anchoAntes}%`,
              background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 60%, #f87171 100%)',
            }}
          >
            <span className="text-white text-xs font-bold tracking-wide">Referencia 100%</span>
          </div>
        </div>
      </div>

      {/* Barra DESPUÉS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground/70">Factura después</span>
          <span className="text-sm font-bold text-primary-600 font-mono">11.200 €/mes</span>
        </div>
        <div
          className="relative h-12 rounded-xl overflow-hidden"
          style={{
            background: 'color-mix(in srgb, var(--background) 90%, var(--color-neutral-100) 10%)',
          }}
        >
          <div
            className="h-full rounded-xl flex items-center"
            style={{
              width: `${anchoDespues}%`,
              background: 'linear-gradient(90deg, #0e754d 0%, #0f935d 50%, #1ab775 100%)',
            }}
          >
            <span className="ml-4 text-white text-xs font-bold tracking-wide hidden sm:block">
              {anchoDespues}% del anterior
            </span>
          </div>
          {/* Badge de ahorro flotante a la derecha de la barra verde */}
          <div
            className="absolute top-0 h-full flex items-center pl-3"
            style={{ left: `${anchoDespues}%` }}
          >
            <span
              className="text-xs font-extrabold tracking-widest px-3 py-1 rounded-full whitespace-nowrap"
              style={{
                background: 'color-mix(in srgb, var(--color-primary-500) 15%, transparent)',
                color: 'var(--color-primary-600)',
                border: '1px solid color-mix(in srgb, var(--color-primary-500) 30%, transparent)',
              }}
            >
              –39%
            </span>
          </div>
        </div>
      </div>

      {/* Leyenda de ahorro */}
      <div
        className="flex items-center justify-between px-5 py-4 rounded-xl"
        style={{
          background: 'color-mix(in srgb, var(--color-primary-500) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-primary-500) 20%, transparent)',
        }}
      >
        <span className="text-sm text-foreground/70">Ahorro mensual verificado</span>
        <span
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: 'var(--color-primary-600)' }}
        >
          7.200 €/mes
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Componente: Línea del tiempo visual de implementación               */
/* ------------------------------------------------------------------ */
function LineaTiempoVisual() {
  const pasos = [
    {
      num: '01',
      titulo: 'Diagnóstico',
      subtitulo: 'Semana 1–2',
      desc: 'Análisis de facturas y auditoría de instalación',
      completado: true,
    },
    {
      num: '02',
      titulo: 'Propuesta',
      subtitulo: 'Semana 3',
      desc: 'Plan de medidas con retorno estimado por acción',
      completado: true,
    },
    {
      num: '03',
      titulo: 'Implementación',
      subtitulo: 'Mes 2–3',
      desc: 'Monitorización, automatización HVAC y ajuste fino',
      completado: true,
    },
    {
      num: '04',
      titulo: 'Ahorro verificado',
      subtitulo: 'Mes 4 en adelante',
      desc: 'Ahorro certificado y control continuo activado',
      completado: true,
    },
  ];

  return (
    <div className="relative">
      {/* Línea conectora horizontal — visible en desktop */}
      <div
        className="hidden lg:block absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-0.5"
        style={{
          background:
            'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-500), var(--color-primary-400))',
        }}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {pasos.map((paso, i) => (
          <div key={paso.num} className="relative flex flex-col items-center text-center">
            {/* Círculo con número */}
            <div
              className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full font-extrabold text-white text-lg shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
                boxShadow:
                  '0 0 0 4px color-mix(in srgb, var(--color-primary-500) 20%, transparent)',
              }}
            >
              {paso.num}
            </div>

            {/* Línea vertical conectora — solo mobile */}
            {i < pasos.length - 1 && (
              <div
                className="lg:hidden w-0.5 h-6 mt-2"
                style={{ background: 'var(--color-primary-300)' }}
              />
            )}

            {/* Contenido */}
            <div className="mt-4 space-y-1">
              <p className="font-heading font-bold text-base text-foreground">{paso.titulo}</p>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'var(--color-primary-600)' }}
              >
                {paso.subtitulo}
              </p>
              <p className="text-xs text-foreground/60 leading-5 max-w-[160px] mx-auto">
                {paso.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de plazo total */}
      <div
        className="mt-8 flex items-center justify-center gap-3 py-3 px-6 rounded-full mx-auto w-fit"
        style={{
          background: 'color-mix(in srgb, var(--color-primary-500) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-primary-500) 25%, transparent)',
        }}
      >
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--color-primary-600)' }}
        >
          Plazo total de ejecución:
        </span>
        <span className="text-sm font-extrabold text-foreground">90 días</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página principal                                                    */
/* ------------------------------------------------------------------ */
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
          <p className="mt-6 text-xs text-foreground/35 leading-5 max-w-2xl">
            El ahorro se calcula comparando facturación normalizada antes y después de las medidas,
            ajustada por ocupación y temporada. Los resultados dependen del estado inicial de la
            instalación, contrato, hábitos de consumo y capacidad de automatización.
          </p>
        </div>
      </section>

      {/* VISUALIZACIÓN: BARRAS DE AHORRO */}
      <section className="section-shell">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Impacto económico</p>
            <h2 className="section-title mt-3 text-foreground">De 18.400 € a 11.200 € al mes</h2>
            <p className="section-copy mt-4 max-w-2xl text-foreground/65">
              La reducción del 39% en la factura mensual supone 7.200 € menos cada mes. Con una
              inversión total de 28.500 €, el retorno se alcanzó en 4,2 meses.
            </p>
          </div>
          <BarrasAhorro />
        </div>
      </section>

      {/* VISUALIZACIÓN: TABLA COMPARATIVA ANTES / DESPUÉS */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Comparativa detallada</p>
            <h2 className="section-title mt-3 text-foreground">Antes y después, punto a punto</h2>
            <p className="section-copy mt-4 max-w-2xl text-foreground/65">
              Cada indicador del hotel comparado antes y después de la intervención.
            </p>
          </div>
          <TablaComparativa />
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

      {/* VISUALIZACIÓN: LÍNEA DEL TIEMPO */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Ejecución</p>
            <h2 className="section-title mt-3 text-foreground">
              Del diagnóstico al ahorro: 90 días
            </h2>
            <p className="section-copy mt-4 max-w-2xl text-foreground/65">
              Cuatro fases secuenciales. Cada una con impacto medible antes de pasar a la siguiente.
            </p>
          </div>
          <LineaTiempoVisual />
        </div>
      </section>

      {/* TIMELINE DETALLADO */}
      <section className="section-shell">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Detalle de actuaciones</p>
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

      {/* TABLA RESUMEN DE MEDIDAS */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="mb-8">
            <p className="eyebrow">Resumen de medidas</p>
            <h2 className="section-title mt-3 text-foreground">Qué se hizo y cuánto aportó</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/10">
                  <th className="pb-4 text-left font-semibold text-foreground/60">Medida</th>
                  <th className="pb-4 text-left font-semibold text-foreground/60">Plazo</th>
                  <th className="pb-4 text-left font-semibold text-foreground/60">Inversión</th>
                  <th className="pb-4 text-left font-semibold text-foreground/60">
                    Ahorro mensual
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                {[
                  {
                    medida: 'Ajuste potencias contratadas',
                    plazo: 'Semana 1–2',
                    inversion: '0 €',
                    ahorro: '680 €/mes',
                  },
                  {
                    medida: 'Monitorización por zonas',
                    plazo: 'Semana 3–4',
                    inversion: '4.200 €',
                    ahorro: 'Control activado',
                  },
                  {
                    medida: 'Automatización climatización (HVAC)',
                    plazo: 'Mes 2',
                    inversion: '18.500 €',
                    ahorro: '~34% consumo HVAC',
                  },
                  {
                    medida: 'Ajuste fino + alertas automáticas',
                    plazo: 'Mes 3',
                    inversion: '5.800 €',
                    ahorro: 'Optimización continua',
                  },
                ].map((row) => (
                  <tr key={row.medida}>
                    <td className="py-4 pr-6 font-medium text-foreground">{row.medida}</td>
                    <td className="py-4 pr-6 text-foreground/60">{row.plazo}</td>
                    <td className="py-4 pr-6 text-foreground/60">{row.inversion}</td>
                    <td className="py-4 text-primary-600 font-semibold dark:text-primary-400">
                      {row.ahorro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIO */}
      <section className="section-shell">
        <div className="section-inner">
          <blockquote className="surface-panel-soft mx-auto max-w-2xl p-10 text-center">
            <p className="text-xl leading-8 text-foreground/80 italic">
              &ldquo;Lo que más me sorprendió no fue el ahorro. Fue ver por primera vez exactamente
              dónde se iba el dinero. Ahora tenemos control real sobre un coste que antes
              simplemente pagábamos.&rdquo;
            </p>
            <footer className="mt-8">
              <p className="font-semibold text-foreground">Director de operaciones</p>
              <p className="text-sm text-foreground/50">Hotel 4★, Costa Brava</p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* NOTA METODOLÓGICA */}
      <section className="section-shell-tight">
        <div className="section-inner">
          <p
            className="text-xs leading-6 max-w-3xl mx-auto text-center"
            style={{ color: 'color-mix(in srgb, var(--foreground) 35%, transparent)' }}
          >
            <strong style={{ color: 'color-mix(in srgb, var(--foreground) 45%, transparent)' }}>
              Nota metodológica:
            </strong>{' '}
            El ahorro se calcula comparando la facturación normalizada antes y después de las
            medidas, ajustada por ocupación y temporada. Los resultados pueden variar según el
            estado inicial de la instalación.
          </p>
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
