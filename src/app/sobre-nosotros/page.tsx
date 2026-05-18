import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';
import { SectionHero } from '@/components/shared/SectionHero';
import { ActionBanner } from '@/components/shared/ActionBanner';

export const metadata = buildPageMetadata({
  title: 'Sobre Webtense Energy | Consultoría Energética Independiente',
  description:
    'Quiénes somos: experiencia técnica en operaciones energéticas, independencia frente a comercializadoras y especialización en datos, automatización y seguimiento.',
  path: '/sobre-nosotros',
  locale: 'root',
});

const values = [
  {
    icon: '◧',
    title: 'Criterio técnico, no comercial',
    desc: 'No somos distribuidores de ninguna tarifa ni recibimos comisiones de comercializadoras. Nuestro único incentivo es que el ahorro real justifique nuestros honorarios.',
  },
  {
    icon: '▣',
    title: 'Especialización en datos y automatización',
    desc: 'La mayor parte del ahorro no viene de cambiar de suministrador, sino de gestionar mejor lo que ya tienes. Eso requiere monitorización, automatización y seguimiento continuado.',
  },
  {
    icon: '◈',
    title: 'Resultados medibles, no estimaciones',
    desc: 'Trabajamos con datos reales de consumo, no con proyecciones teóricas. Cada informe refleja el ahorro certificado del periodo, no el potencial de ahorro futuro.',
  },
  {
    icon: '◫',
    title: 'Operaciones técnicas sin interrupciones',
    desc: 'Toda la implementación se diseña para no interferir en tu actividad. Auditamos y ejecutamos medidas sin paralizar ni modificar tu operativa habitual.',
  },
];

const sectors = [
  {
    label: 'Hoteles y alojamiento',
    detail: 'Gestión de climatización, iluminación y consumos por zonas.',
  },
  {
    label: 'Restauración organizada',
    detail: 'Optimización tarifaria, cocinas industriales y refrigeración.',
  },
  {
    label: 'Industria ligera',
    detail: 'Potencias contratadas, maquinaria y turnos de producción.',
  },
  { label: 'Retail y logística', detail: 'Iluminación, climatización y gestión de flota de frío.' },
];

export default function SobreNosotrosPage() {
  return (
    <div className="flex flex-col bg-background">
      <SectionHero
        eyebrow="Sobre Webtense Energy"
        title="Experiencia técnica al servicio del ahorro real"
        subtitle="Trabajamos con empresas que pagan facturas eléctricas relevantes y quieren entender, de una vez, qué pueden hacer con ellas. Sin promesas genéricas. Con datos."
        actions={
          <>
            <Link href="/estudio" className="cta-primary">
              Solicitar análisis gratuito
            </Link>
            <Link href="/caso-real" className="cta-secondary">
              Ver caso real
            </Link>
          </>
        }
      />

      {/* EQUIPO */}
      <section className="section-shell">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Equipo</p>
            <h2 className="section-title mt-3 text-foreground">La persona detrás del proyecto</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <div className="surface-panel p-8 flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-brand-500 text-white font-heading text-3xl font-bold">
                AS
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-foreground">
                Andrés Sánchez
              </h3>
              <p className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                Director Técnico · Fundador
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://wa.me/34691521367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip-outline text-xs"
                >
                  WhatsApp
                </a>
                <a href="mailto:info@webtenseenergy.com" className="chip-outline text-xs">
                  Email
                </a>
              </div>
            </div>
            <div className="space-y-5 text-sm leading-7 text-foreground/70">
              <p>
                Llevo más de una década gestionando infraestructura técnica y operaciones en
                instalaciones de alta demanda energética: hoteles de montaña con carga continua de
                climatización, sistemas ACS industriales, automatización de instalaciones con
                cientos de puntos de control y contratos energéticos complejos que había que
                entender desde dentro para poder optimizar.
              </p>
              <p>
                Esa experiencia práctica es lo que diferencia Webtense Energy de la mayoría de
                consultoras energéticas. No analizamos facturas desde un Excel: sabemos lo que
                ocurre en sala de calderas, qué significa una lectura de potencia fuera de rango,
                cómo se comporta un sistema de climatización bajo carga real y qué palancas tienen
                impacto directo en el coste sin tocar la operativa.
              </p>
              <p>
                Me especializo en automatización y monitorización energética con herramientas como
                Home Assistant, y en la integración de datos de consumo con sistemas de gestión de
                instalaciones. Trabajé durante años con equipos de mantenimiento de varios hoteles
                simultaneamente, lo que me permitió identificar patrones de ineficiencia que solo se
                ven cuando tienes visión global de instalaciones comparables.
              </p>
              <p>
                Webtense Energy nació de la certeza de que la mayoría de empresas con consumo
                energético relevante está pagando entre un 20% y un 45% más de lo que debería, y de
                que ese margen es técnicamente capturable sin obras ni cambios de suministrador.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: 'Años de experiencia', value: '+10' },
                  { label: 'Instalaciones gestionadas', value: '+50' },
                  { label: 'Ahorro medio verificado', value: '28%' },
                ].map((stat) => (
                  <div key={stat.label} className="surface-panel-soft p-4 text-center">
                    <p className="card-stat-value text-2xl">{stat.value}</p>
                    <p className="card-stat-label text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="section-shell-muted">
        <div className="section-inner grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="eyebrow">Enfoque</p>
            <h2 className="section-title mt-3 text-foreground">
              La energía no se gestiona cambiando de comercializadora
            </h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-foreground/70">
              <p>
                La mayoría de empresas recibe la factura, la aprueba y la paga. Nadie tiene tiempo
                de analizarla en profundidad, y el resultado es que se acumulan años de
                ineficiencias que nadie ha cuantificado.
              </p>
              <p>
                Webtense Energy nació de la experiencia en operaciones técnicas reales: proyectos de
                automatización industrial, gestión de instalaciones y análisis de consumos en
                entornos de alta demanda. Esa base técnica es lo que nos permite ir más allá del
                análisis de factura y actuar sobre el consumo real.
              </p>
              <p>
                Nos especializamos en negocios con facturas superiores a 3.000 €/mes porque es el
                umbral a partir del cual el ahorro potencial justifica un trabajo serio, y el
                nuestro es siempre serio.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {values.map((v) => (
              <div key={v.title} className="surface-panel-soft p-6 flex gap-5">
                <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/65">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORES */}
      <section className="section-shell">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Sectores</p>
            <h2 className="section-title mt-3 text-foreground">Con quién trabajamos</h2>
            <p className="section-copy mt-4 max-w-2xl">
              Cada sector tiene patrones de consumo distintos. Trabajamos con equipos técnicos y de
              operaciones que entienden que la energía es un coste gestionable, no un fijo
              inevitable.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((s) => (
              <div key={s.label} className="surface-panel-soft p-6">
                <h3 className="font-heading text-base font-bold tracking-tight text-foreground">
                  {s.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground/60">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="El primer paso no cuesta nada."
            description="Envíanos tus últimas 3 facturas. En 48 horas te decimos si hay margen de mejora real y qué tipo de intervención tendría más impacto en tu caso concreto."
            action={
              <Link href="/estudio" className="cta-primary">
                Solicitar análisis gratuito — solo negocios +3.000 €/mes
              </Link>
            }
          />
        </div>
      </section>
    </div>
  );
}
