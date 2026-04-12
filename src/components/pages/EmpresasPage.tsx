import Link from "next/link";
import { withBasePath } from "@/lib/paths";
import { SectionHero } from "@/components/shared/SectionHero";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { MetricPill } from "@/components/shared/MetricPill";
import { ActionBanner } from "@/components/shared/ActionBanner";

type EmpresasPageProps = {
  basePath: string;
};

export function EmpresasPage({ basePath }: EmpresasPageProps) {
  const pains = [
    "Contratos mal ajustados que encarecen cada MWh sin que el equipo lo perciba.",
    "Falta de seguimiento mensual y decisiones tomadas con visión parcial de consumo.",
    "Potencias, penalizaciones o calendarios tarifarios que no acompañan la operación real.",
  ];

  const services = [
    { title: "Optimización de contratos", desc: "Revisamos estructura, potencias, periodos y condiciones para alinear compra y consumo.", icon: "📑" },
    { title: "Gestión energética", desc: "Seguimiento periódico del gasto y los desvíos para detectar fugas de margen con rapidez.", icon: "📊" },
    { title: "Auditoría técnica", desc: "Analizamos suministro, incidencias, calidad, reactiva y oportunidades de mejora operativa.", icon: "⚡" },
    { title: "Renovables y viabilidad", desc: "Estudios de autoconsumo y electrificación con foco en retorno y estabilidad futura.", icon: "☀️" },
  ];

  const process = [
    { title: "1. Diagnóstico", desc: "Partimos de facturas, curvas y contexto operativo para ver dónde está el margen real." },
    { title: "2. Propuesta", desc: "Traducimos el análisis en medidas concretas, priorizadas y fáciles de decidir." },
    { title: "3. Implantación", desc: "Acompañamos cambios de tarifa, ajustes técnicos o despliegues que tengan sentido." },
    { title: "4. Seguimiento", desc: "Revisamos resultados para que el ahorro no dependa de una única decisión aislada." },
  ];

  return (
    <div className="flex flex-col bg-background">
      <SectionHero
        eyebrow="Consultoría energética B2B"
        title={<>Energía bajo control para <span className="text-primary-600 dark:text-primary-300">operaciones que no pueden improvisar</span></>}
        subtitle="Trabajamos con empresas que quieren reducir coste, ganar visibilidad y tomar decisiones con criterio sobre contratos, potencias, calidad de suministro y transición energética."
        actions={
          <>
            <Link href={withBasePath(basePath, "/contacto")} className="cta-primary">Solicitar diagnóstico</Link>
            <Link href={withBasePath(basePath, "/estudio")} className="cta-secondary">Subir facturas</Link>
          </>
        }
        aside={
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricPill label="Ahorro medio" value="12-18%" />
            <MetricPill label="Enfoque" value="Control + coste" />
            <MetricPill label="Respuesta" value="48h" />
          </div>
        }
      />

      <section className="section-shell">
        <div className="section-inner grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionIntro
            eyebrow="Problemas frecuentes"
            title="El coste energético no se dispara solo por el precio"
            description="En la práctica, muchas pérdidas vienen de mala configuración contractual, falta de seguimiento o decisiones tomadas sin leer bien la operación real."
          />
          <div className="grid gap-4">
            {pains.map((pain) => (
              <div key={pain} className="surface-panel-soft p-6 text-sm leading-7 text-foreground/75">{pain}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro eyebrow="Servicios" title="Una capa de análisis, decisión y seguimiento" description="No vendemos solo un informe. Diseñamos una forma de gestionar mejor la energía y de defender margen con menos incertidumbre." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="surface-panel-soft p-7 transition hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-500/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{service.icon}</div>
                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionIntro eyebrow="Método" title="Primero claridad, después ejecución" description="La secuencia importa: no se trata de aplicar medidas aleatorias, sino de intervenir donde el impacto es mayor y la fricción menor." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {process.map((step) => (
              <div key={step.title} className="surface-panel-soft p-6">
                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="Si tu operación depende de la energía, necesitas una lectura más estratégica"
            description="Comparte tus facturas o tu escenario actual y te devolvemos un punto de partida claro: dónde estás perdiendo margen y qué conviene atacar primero."
            action={<Link href={withBasePath(basePath, "/contacto")} className="cta-primary">Hablar con el equipo</Link>}
          />
        </div>
      </section>
    </div>
  );
}
