import Image from "next/image";
import Link from "next/link";
import { getSiteSettingValue } from "@/lib/site-settings";
import { withBasePath } from "@/lib/paths";
import { SectionHero } from "@/components/shared/SectionHero";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { MetricPill } from "@/components/shared/MetricPill";
import { ActionBanner } from "@/components/shared/ActionBanner";
import { SavingsCalculator } from "@/components/energy/SavingsCalculator";

type HomePageProps = {
  locale: "ES" | "CA";
  basePath: string;
};

export async function HomePage({ locale, basePath }: HomePageProps) {
  const heroTitle = await getSiteSettingValue("home.hero.title", locale, "Eficiencia y control para tu negocio y hogar");
  const heroSubtitle = await getSiteSettingValue(
    "home.hero.subtitle",
    locale,
    "Analizamos consumos, tarifas y hábitos para que empresas y particulares tomen mejores decisiones energéticas con menos ruido y más claridad.",
  );

  const pillars = [
    {
      title: "Empresas",
      desc: "Consultoría energética con foco en coste operativo, contratos, seguimiento y control.",
      href: withBasePath(basePath, "/empresas"),
      icon: "▣",
    },
    {
      title: "Particulares",
      desc: "Tarifa, autoconsumo, hábitos y domótica para un hogar que consuma mejor y viva más cómodo.",
      href: withBasePath(basePath, "/particulares"),
      icon: "⌂",
    },
    {
      title: "Conocimiento útil",
      desc: "Blog, ofertas verificadas y herramientas para entender la energía sin lenguaje opaco.",
      href: withBasePath(basePath, "/blog"),
      icon: "◫",
    },
  ];

  const tools = [
    {
      title: "Precio de la luz hoy",
      desc: "Consulta el mejor tramo horario, los picos del día y recomendaciones prácticas para mover consumos.",
      href: withBasePath(basePath, "/luz/precio-hoy"),
      cta: "Abrir panel diario",
    },
    {
      title: "Selección de ofertas",
      desc: "Una capa curada de productos de domótica, solar y monitorización con foco real en eficiencia y control.",
      href: withBasePath(basePath, "/ofertas"),
      cta: "Explorar ofertas",
    },
  ];

  return (
    <div className="flex flex-col bg-background">
      <SectionHero
        eyebrow="Plataforma energética útil"
        title={heroTitle}
        subtitle={heroSubtitle}
        actions={
          <>
            <Link href={withBasePath(basePath, "/estudio")} className="cta-primary">
              Solicitar estudio gratuito
            </Link>
            <Link href={withBasePath(basePath, "/empresas")} className="cta-secondary">
              Ver soluciones
            </Link>
          </>
        }
        aside={
          <div className="surface-panel overflow-hidden p-4">
            <div className="grid gap-4">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#06111d] p-5 text-white">
                <div className="absolute inset-0 opacity-80">
                  <Image src="/images/hero_home.png" alt="Webtense Energy" fill className="object-cover mix-blend-luminosity opacity-30" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-300">Control energético</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">12-18%</p>
                    <p className="mt-1 text-sm text-white/70">Ahorro potencial medio cuando la estrategia parte de datos reales.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricPill label="Estudio" value="48h" />
                    <MetricPill label="Enfoque" value="B2B + Hogar" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <section className="section-shell-muted">
        <div className="section-inner">
          <div className="flex flex-wrap gap-3">
            <div className="metric-chip"><span className="h-2 w-2 rounded-full bg-primary-500"></span>Estudio gratuito con respuesta en 48h</div>
            <div className="metric-chip"><span className="h-2 w-2 rounded-full bg-brand-500"></span>Consultoría para empresa y hogar</div>
            <div className="metric-chip"><span className="h-2 w-2 rounded-full bg-amber-500"></span>Blog, ofertas y herramientas en una misma plataforma</div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Rutas de entrada"
            title="Tres puertas, un mismo criterio: menos coste, más control y decisiones mejores"
            description="WebTenseEnergy no es solo una web corporativa. Es una capa de asesoramiento, herramientas útiles y contenido práctico para mejorar cómo consumes energía."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <Link key={pillar.title} href={pillar.href} className="surface-panel-soft group p-7 transition hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-500/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-2xl text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {pillar.icon}
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{pillar.desc}</p>
                <div className="mt-5 text-sm font-semibold text-primary-600 transition group-hover:translate-x-1 dark:text-primary-300">Entrar →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro
            eyebrow="Herramientas útiles"
            title="Menos promesas abstractas, más utilidades que ayudan a decidir"
            description="La v3.1 pone el foco en herramientas concretas: consultar, estimar, comparar y actuar."
            align="center"
          />
          <div className="mt-12">
            <SavingsCalculator basePath={basePath} />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="surface-panel-soft group p-7 transition hover:-translate-y-1 hover:border-brand-300 dark:hover:border-brand-500/20">
                <p className="eyebrow">Utilidad</p>
                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">{tool.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{tool.desc}</p>
                <div className="mt-6 text-sm font-semibold text-brand-600 transition group-hover:translate-x-1 dark:text-brand-300">{tool.cta} →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-panel-soft p-8 md:p-10">
            <p className="eyebrow">Contenido + comunidad</p>
            <h2 className="section-title mt-5 text-foreground">Guías, comparativas y decisiones bien explicadas</h2>
            <p className="section-copy mt-4 max-w-2xl">
              El blog y el canal de ofertas funcionan como extensión del servicio: explicar bien, filtrar mejor y reducir el ruido que rodea a la energía, la domótica y las compras técnicas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={withBasePath(basePath, "/blog")} className="cta-secondary">Ir al blog</Link>
              <Link href="https://t.me/webtenseenergy" target="_blank" rel="noopener noreferrer" className="cta-primary">Unirme a Telegram</Link>
            </div>
          </div>
          <div className="surface-panel-soft p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">Lo más buscado</p>
            <div className="mt-5 space-y-4 text-sm text-foreground/70">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/5">Optimizar tarifa y potencia sin papeleo innecesario</div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/5">Entender cuándo conviene mover consumos a valle</div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/5">Elegir domótica y monitorización con criterio, no por moda</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title="Empieza por tu factura y construye desde ahí"
            description="Sube tu factura o cuéntanos tu escenario. Te damos una lectura clara del punto de partida y la siguiente mejor acción para ahorrar o ganar control."
            action={<Link href={withBasePath(basePath, "/estudio")} className="cta-primary">Empezar estudio</Link>}
          />
        </div>
      </section>
    </div>
  );
}
