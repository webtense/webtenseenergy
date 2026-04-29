import ElectricityDashboard from '@/components/electricity/ElectricityDashboard';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import { SectionHero } from '@/components/shared/SectionHero';
import { ActionBanner } from '@/components/shared/ActionBanner';

type FaqItem = {
  question: string;
  answer: string;
};

type PrecioLuzHoyPageProps = {
  basePath: string;
  faqItems?: FaqItem[];
};

export function PrecioLuzHoyPage({ basePath, faqItems }: PrecioLuzHoyPageProps) {
  return (
    <main className="min-h-screen bg-background pb-16">
      <SectionHero
        eyebrow="Panel diario"
        title={
          <>
            Precio de la luz hoy,{' '}
            <span className="text-primary-600 dark:text-primary-300">
              sin interpretaciones raras
            </span>
          </>
        }
        subtitle="Consulta tramos horarios, precio actual, medias y extremos del día para mover consumos con más criterio."
        compact
        actions={
          <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
            Quiero optimizar mi factura
          </Link>
        }
      />

      <section className="section-shell-tight">
        <div className="section-inner mb-6">
          <Link
            href={withBasePath(basePath, '/')}
            className="text-sm font-semibold text-primary-600 dark:text-primary-300"
          >
            ← Volver al inicio
          </Link>
        </div>
        <div className="section-inner surface-panel overflow-hidden p-4 md:p-8">
          <ElectricityDashboard />
        </div>
      </section>

      {faqItems && faqItems.length > 0 && (
        <section className="section-shell-tight">
          <div className="section-inner">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-8">
              Preguntas frecuentes sobre el precio de la luz
            </h2>
            <dl className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.question} className="surface-panel-soft p-6">
                  <dt className="font-semibold text-foreground text-lg mb-2">{item.question}</dt>
                  <dd className="text-foreground/70 leading-7 text-sm">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="Mirar el precio es útil. Entender tu factura completa, mucho más"
            description="Si quieres saber cuánto puedes ahorrar de verdad, no basta con ver el pool: hay que leer potencia, hábitos, tarifa y distribución real del consumo."
            action={
              <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
                Solicitar estudio
              </Link>
            }
          />
        </div>
      </section>
    </main>
  );
}
