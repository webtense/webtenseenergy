import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';
import { ActionBanner } from '@/components/shared/ActionBanner';

export const metadata = buildPageMetadata({
  title: 'Checklist gratuito: ¿Tu empresa está pagando energía de más? | Webtense Energy',
  description:
    'Descarga gratis el checklist de 20 puntos para detectar si tu empresa tiene ineficiencias energéticas sin necesidad de ninguna auditoría previa.',
  path: '/recursos/checklist-energia',
  locale: 'root',
});

const checks = [
  {
    section: 'Factura y contrato',
    items: [
      'La factura lleva más de 12 meses sin que nadie la haya analizado en detalle',
      'No sabes cuánto pagas exactamente en término de potencia vs. término de energía',
      'Aparece la línea "Excesos de potencia" de forma recurrente en algún periodo',
      'Las potencias contratadas son iguales en todos los periodos (P1 a P6)',
      'No has revisado si tu tarifa actual (3.0TD, 6.X) es la más adecuada para tu perfil',
    ],
  },
  {
    section: 'Climatización',
    items: [
      'El sistema de climatización funciona con horario fijo, no según ocupación real',
      'No hay diferencia de temperatura programada entre zonas ocupadas y vacías',
      'La temperatura se mantiene igual en temporada alta y baja',
      'No sabes cuándo fue la última vez que se limpiaron los filtros o se recargó el gas',
      'No tienes datos de consumo específico del sistema HVAC',
    ],
  },
  {
    section: 'Monitorización y datos',
    items: [
      'Tienes un único contador para todo el negocio (sin subcontadores por zonas)',
      'No recibes alertas cuando el consumo sube de forma anómala',
      'El consumo nocturno o en festivos no lo conoces con precisión',
      'No dispones de la curva de carga horaria de los últimos 12 meses',
      'El equipo de mantenimiento gestiona los equipos sin datos de consumo en tiempo real',
    ],
  },
  {
    section: 'Iluminación y equipos auxiliares',
    items: [
      'La iluminación de zonas comunes, almacenes o pasillos está encendida en horas de no uso',
      'No hay sensores de presencia en zonas de uso discontinuo',
      'Los equipos de oficina (servidores, impresoras, pantallas) no tienen gestión de stand-by',
      'No sabes cuántos equipos permanecen en consumo fantasma fuera del horario laboral',
      'La iluminación exterior no se regula según la hora solar',
    ],
  },
];

export default function ChecklistEnergiaPage() {
  return (
    <div className="flex flex-col bg-background">
      {/* HERO */}
      <section className="section-shell bg-[#06111d] text-white">
        <div className="section-inner">
          <p className="eyebrow text-primary-300">Recurso gratuito</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight lg:text-5xl">
            Checklist: ¿Tu empresa está pagando energía de más?
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            20 preguntas para detectar ineficiencias energéticas sin necesidad de auditoría previa.
            Si marcas más de 5, hay margen de mejora relevante.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/recursos/checklist-energia/imprimir"
              className="cta-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Imprimir / Guardar como PDF
            </a>
            <Link href="/estudio" className="cta-secondary border-white/20 text-white/80 hover:text-white">
              Solicitar análisis gratuito
            </Link>
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="section-shell">
        <div className="section-inner max-w-3xl">
          <p className="text-sm text-foreground/50 mb-8">
            Marca cada punto que aplique a tu situación actual. Cuantos más marques, mayor es el potencial de ahorro sin inversión técnica.
          </p>
          <div className="space-y-10">
            {checks.map((section) => (
              <div key={section.section}>
                <h2 className="font-heading text-lg font-bold tracking-tight text-foreground mb-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                  {section.section}
                  <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                </h2>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="surface-panel-soft flex items-start gap-4 p-5"
                    >
                      <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 border-zinc-300 dark:border-zinc-600" />
                      <span className="text-sm leading-6 text-foreground/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* RESULTADO */}
          <div className="mt-14 surface-panel p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">
              ¿Has marcado 5 o más puntos?
            </p>
            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Hay margen de mejora. El análisis previo es gratuito.
            </h3>
            <p className="mt-4 text-sm leading-7 text-foreground/65 max-w-xl mx-auto">
              Envíanos tus últimas 3 facturas. En 48 horas te decimos exactamente cuánto puedes
              ahorrar y qué medidas tienen más impacto en tu caso concreto. Sin visita, sin coste,
              sin compromiso.
            </p>
            <Link href="/estudio" className="cta-primary mt-6 inline-flex">
              Solicitar análisis — solo negocios +3.000 €/mes
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="¿Quieres ver un caso real antes de decidir?"
            description="Un hotel independiente de 82 habitaciones pasó de 18.400 € a 11.200 € de factura mensual en 90 días. Todos los datos están documentados."
            action={
              <Link href="/caso-real" className="cta-primary">
                Ver el caso completo
              </Link>
            }
          />
        </div>
      </section>
    </div>
  );
}
