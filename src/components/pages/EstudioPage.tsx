import EnergyAuditWizard from "@/components/ui/EnergyAuditWizard";
import { SectionHero } from "@/components/shared/SectionHero";
import { SectionIntro } from "@/components/shared/SectionIntro";

export function EstudioPage() {
  const benefits = [
    { title: "Lectura clara", desc: "Te explicamos el punto de partida antes de hablar de cambios o productos.", icon: "◫" },
    { title: "Sin papeleo", desc: "Si decides avanzar, te ayudamos a ejecutar el siguiente paso con menos fricción.", icon: "⚡" },
    { title: "Enfoque independiente", desc: "El criterio parte de tu consumo y tu caso, no de vender una solución cerrada.", icon: "▣" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SectionHero
        eyebrow="Estudio energético"
        title={<>Empieza por tu factura y deja que el siguiente paso salga de <span className="text-primary-600 dark:text-primary-300">los datos</span></>}
        subtitle="Sube una factura o cuéntanos tu consumo. Analizamos tarifa, potencia y hábitos para detectar el margen real de mejora en hogar o negocio."
        align="center"
      />

      <section className="section-shell-tight -mt-8 md:-mt-12 relative z-10">
        <div className="section-inner">
          <EnergyAuditWizard />
        </div>
      </section>

      <section className="section-shell pb-24">
        <div className="section-inner">
          <SectionIntro eyebrow="Qué recibes" title="Una lectura práctica, no un informe decorativo" description="La idea es sencilla: entender tu situación actual, detectar oportunidades y devolverte una recomendación clara sobre qué hacer primero." align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((item) => (
              <div key={item.title} className="surface-panel-soft p-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-2xl text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">{item.icon}</div>
                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
