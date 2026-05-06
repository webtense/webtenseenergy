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
  { label: 'Hoteles y alojamiento', detail: 'Gestión de climatización, iluminación y consumos por zonas.' },
  { label: 'Restauración organizada', detail: 'Optimización tarifaria, cocinas industriales y refrigeración.' },
  { label: 'Industria ligera', detail: 'Potencias contratadas, maquinaria y turnos de producción.' },
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

      {/* QUIÉNES SOMOS */}
      <section className="section-shell">
        <div className="section-inner grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="eyebrow">Enfoque</p>
            <h2 className="section-title mt-3 text-foreground">
              La energía no se gestiona cambiando de comercializadora
            </h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-foreground/70">
              <p>
                La mayoría de empresas recibe la factura, la aprueba y la paga. Nadie tiene tiempo
                de analizarla en profundidad, y el resultado es que se acumulan años de ineficiencias
                que nadie ha cuantificado.
              </p>
              <p>
                Webtense Energy nació de la experiencia en operaciones técnicas reales: proyectos de
                automatización industrial, gestión de instalaciones y análisis de consumos en entornos
                de alta demanda. Esa base técnica es lo que nos permite ir más allá del análisis de
                factura y actuar sobre el consumo real.
              </p>
              <p>
                Nos especializamos en negocios con facturas superiores a 3.000 €/mes porque es el
                umbral a partir del cual el ahorro potencial justifica un trabajo serio, y el nuestro
                es siempre serio.
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
      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="mb-10">
            <p className="eyebrow">Sectores</p>
            <h2 className="section-title mt-3 text-foreground">Con quién trabajamos</h2>
            <p className="section-copy mt-4 max-w-2xl">
              Cada sector tiene patrones de consumo distintos. Trabajamos con equipos técnicos y de
              operaciones que entienden que la energía es un coste gestionable, no un fijo inevitable.
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
