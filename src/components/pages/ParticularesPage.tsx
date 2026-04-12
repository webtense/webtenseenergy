import Link from "next/link";
import { withBasePath } from "@/lib/paths";
import { SectionHero } from "@/components/shared/SectionHero";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { ActionBanner } from "@/components/shared/ActionBanner";
import { SavingsCalculator } from "@/components/energy/SavingsCalculator";

type ParticularesPageProps = {
  basePath: string;
};

export function ParticularesPage({ basePath }: ParticularesPageProps) {
  const scenarios = [
    { title: "Teletrabajo", desc: "Más horas en casa, mayor peso del término variable y necesidad de una tarifa mejor ajustada." },
    { title: "Familia", desc: "Picos de uso, confort y electrodomésticos que conviene mover sin perder calidad de vida." },
    { title: "Consumo nocturno", desc: "Perfiles valle con margen para ahorrar bastante si la estructura tarifaria acompaña." },
    { title: "Solar + domótica", desc: "Autoconsumo, monitorización y automatización para convertir datos en decisiones cotidianas." },
  ];

  const solutions = [
    "Optimización de tarifa y potencia con base en consumo real.",
    "Lectura de tu factura para entender dónde se va el dinero.",
    "Domótica útil para mover cargas, monitorizar y ganar control.",
    "Criterio para valorar placas, baterías y retornos sin ruido comercial.",
  ];

  return (
    <div className="flex flex-col bg-background">
      <SectionHero
        eyebrow="Hogar eficiente"
        title={<>Ahorra en tu factura y convierte tu casa en un sistema <span className="text-primary-600 dark:text-primary-300">más inteligente</span></>}
        subtitle="Tarifa, hábitos, solar y domótica deben trabajar juntos. La idea no es añadir gadgets porque sí, sino reducir coste y ganar confort con criterio."
        actions={
          <>
            <Link href={withBasePath(basePath, "/estudio")} className="cta-primary">Analizar mi factura</Link>
            <Link href={withBasePath(basePath, "/luz/precio-hoy")} className="cta-secondary">Ver precio de hoy</Link>
          </>
        }
      />

      <section className="section-shell">
        <div className="section-inner">
          <SectionIntro eyebrow="Escenarios" title="Cada hogar consume distinto. La estrategia también debería hacerlo." description="La misma tarifa no sirve igual para quien teletrabaja, para quien concentra el consumo por la noche o para quien ya tiene solar y quiere más control." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {scenarios.map((scenario) => (
              <div key={scenario.title} className="surface-panel-soft p-6">
                <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">{scenario.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{scenario.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell-muted">
        <div className="section-inner grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionIntro eyebrow="Qué puedes mejorar" title="Menos improvisación, más pequeños cambios que sí se notan" description="La mayoría de hogares puede mejorar en cuatro frentes: tarifa, horarios, equipos y lectura real del consumo." />
          <div className="grid gap-4">
            {solutions.map((solution) => (
              <div key={solution} className="surface-panel-soft flex items-start gap-4 p-5 text-sm leading-7 text-foreground/75">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">✓</span>
                <span>{solution}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner">
          <SectionIntro eyebrow="Estimación rápida" title="Una referencia inmediata antes de pedir un análisis completo" description="Esta calculadora no sustituye un estudio, pero sí te da una señal rápida de cuánto margen puede haber en tu situación actual." align="center" />
          <div className="mt-12">
            <SavingsCalculator basePath={basePath} />
          </div>
        </div>
      </section>

      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="Si ya pagas la luz cada mes, ya tienes una oportunidad de mejora"
            description="Sube tu factura o cuéntanos tu caso. Revisamos consumo, potencia y margen de ahorro con una propuesta clara y sin compromiso."
            action={<Link href={withBasePath(basePath, "/estudio")} className="cta-primary">Solicitar estudio</Link>}
          />
        </div>
      </section>
    </div>
  );
}
