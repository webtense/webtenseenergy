import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import { SectionHero } from '@/components/shared/SectionHero';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { ActionBanner } from '@/components/shared/ActionBanner';

type SobreNosotrosPageProps = {
  basePath: string;
  lang?: 'es' | 'ca';
};

type Content = {
  eyebrowHero: string;
  titleHero: string;
  subtitleHero: string;
  eyebrowWhy: string;
  titleWhy: string;
  descWhy: string;
  whyPoints: { title: string; desc: string }[];
  eyebrowWho: string;
  titleWho: string;
  whoBlocks: { icon: string; title: string; desc: string }[];
  eyebrowHow: string;
  titleHow: string;
  descHow: string;
  steps: { num: string; title: string; desc: string }[];
  eyebrowDiff: string;
  titleDiff: string;
  descDiff: string;
  diffPoints: { icon: string; title: string; desc: string }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
};

const ES: Content = {
  eyebrowHero: 'Sobre Webtense Energy',
  titleHero: 'Consultoría energética independiente',
  subtitleHero:
    'No vendemos energía ni representamos a ninguna comercializadora. Nuestro único trabajo es reducir lo que pagas por ella, con datos y sin letra pequeña.',

  eyebrowWhy: 'Por qué existimos',
  titleWhy: 'Las empresas pagan energía de más. Y lo saben.',
  descWhy:
    'El problema no es la tarifa. Es que nadie analiza la factura en serio. Se aprueba, se paga y el ciclo se repite. Mientras tanto, los excesos de potencia, la discriminación horaria mal configurada y los equipos sin gestión acumulan sobrecostes que nadie ha cuantificado.',

  whyPoints: [
    {
      title: 'No cambiamos tu suministrador',
      desc: 'El 80% del ahorro real no viene de cambiar de comercializadora. Viene de gestionar mejor lo que ya tienes: potencias, horarios, automatización y monitorización.',
    },
    {
      title: 'Independencia total',
      desc: 'No recibimos comisiones de ningún proveedor de energía. No tenemos incentivo para recomendarte nada que no sea lo que más te ahorra.',
    },
    {
      title: 'Seguimiento real',
      desc: 'No entregamos un informe y desaparecemos. Verificamos el ahorro mes a mes y ajustamos si algo no funciona como lo proyectamos.',
    },
  ],

  eyebrowWho: 'Quiénes somos',
  titleWho: 'Técnicos de operaciones, no asesores de despacho',
  whoBlocks: [
    {
      icon: '◧',
      title: 'Experiencia en instalaciones reales',
      desc: 'Más de una década gestionando infraestructura técnica en entornos de alta demanda: hoteles de montaña, sistemas ACS industriales, climatización bajo carga continua. Sabemos lo que ocurre en sala de calderas.',
    },
    {
      icon: '▣',
      title: 'Especialización en datos y automatización',
      desc: 'Análisis de consumos con datos reales, integración de sensores, automatización con plataformas como Home Assistant y paneles de control que muestran el ahorro certificado por periodo.',
    },
    {
      icon: '◈',
      title: 'Independencia estructural',
      desc: 'No somos comercializadores ni distribuidores. No vendemos hardware de terceros por margen. El único alineamiento de incentivos posible es que tu factura baje.',
    },
    {
      icon: '◫',
      title: 'Especialización sectorial',
      desc: 'Hostelería, restauración, industria ligera y retail. Cada sector tiene patrones de consumo distintos y soluciones distintas. No aplicamos la misma receta a todo el mundo.',
    },
  ],

  eyebrowHow: 'Cómo trabajamos',
  titleHow: 'Cuatro pasos. Sin riesgo previo.',
  descHow:
    'El proceso completo no requiere ningún compromiso hasta que tienes los números encima de la mesa.',

  steps: [
    {
      num: '01',
      title: 'Diagnóstico',
      desc: 'Analizamos tus facturas y el consumo real de tu instalación. En 48 horas te decimos si hay margen, cuánto es y de dónde viene. Sin coste ni compromiso.',
    },
    {
      num: '02',
      title: 'Propuesta concreta',
      desc: 'Plan de acción con el ahorro estimado por medida, el coste de implementación y el plazo de retorno. Suficiente para justificarlo internamente.',
    },
    {
      num: '03',
      title: 'Implementación',
      desc: 'Acompañamiento en la ejecución de cada medida. Sin paralizar tu operativa. Sin interferir en el servicio. Con plazos concretos y entregables reales.',
    },
    {
      num: '04',
      title: 'Seguimiento',
      desc: 'Informe mensual con el ahorro real del periodo, no con proyecciones. Si algo no está funcionando como se esperaba, lo detectamos y actuamos.',
    },
  ],

  eyebrowDiff: 'Por qué somos diferentes',
  titleDiff: 'Tres diferencias que importan cuando hablas con un director financiero',
  descDiff:
    'Hay muchas consultoras que prometen ahorros. Pocas que los certifiquen. Menos aún que trabajen sin incentivo para venderte nada.',

  diffPoints: [
    {
      icon: '◧',
      title: 'Independencia',
      desc: 'No somos intermediarios de ninguna comercializadora. No recibimos comisiones de proveedores. Si no hay ahorro real, no hay proyecto.',
    },
    {
      icon: '▣',
      title: 'Datos reales',
      desc: 'Trabajamos con mediciones de consumo real, no con simulaciones teóricas. El informe final refleja lo que ocurrió, no lo que podría ocurrir.',
    },
    {
      icon: '◈',
      title: 'Sin letra pequeña',
      desc: 'Honorarios fijos o alineados con el ahorro conseguido. Sin permanencias, sin renovaciones automáticas, sin cláusulas que te aten si los resultados no llegan.',
    },
  ],

  ctaTitle: '¿Tu empresa paga más de 3.000 €/mes en electricidad?',
  ctaDesc:
    'Ese es el umbral a partir del cual el ahorro potencial justifica un análisis serio. Envíanos tus últimas tres facturas. En 48 horas te decimos si hay margen y cuánto puedes recuperar.',
  ctaButton: 'Solicita tu estudio gratuito',
};

const CA: Content = {
  eyebrowHero: 'Sobre Webtense Energy',
  titleHero: 'Consultoria energètica independent',
  subtitleHero:
    "No venem energia ni representem cap comercialitzadora. La nostra única feina és reduir el que pagues per ella, amb dades i sense lletra petita.",

  eyebrowWhy: 'Per què existim',
  titleWhy: "Les empreses paguen energia de més. I ho saben.",
  descWhy:
    "El problema no és la tarifa. És que ningú analitza la factura seriosament. S'aprova, es paga i el cicle es repeteix. Mentrestant, els excessos de potència, la discriminació horària mal configurada i els equips sense gestió acumulen sobrecostos que ningú ha quantificat.",

  whyPoints: [
    {
      title: 'No canviem el teu subministrador',
      desc: "El 80% de l'estalvi real no ve de canviar de comercialitzadora. Ve de gestionar millor el que ja tens: potències, horaris, automatització i monitorització.",
    },
    {
      title: 'Independència total',
      desc: "No rebem comissions de cap proveïdor d'energia. No tenim incentiu per recomanar-te res que no sigui el que t'estalvia més.",
    },
    {
      title: 'Seguiment real',
      desc: "No entreguem un informe i desapareixem. Verifiquem l'estalvi mes a mes i ajustem si alguna cosa no funciona com ho vam projectar.",
    },
  ],

  eyebrowWho: 'Qui som',
  titleWho: "Tècnics d'operacions, no assessors de despatx",
  whoBlocks: [
    {
      icon: '◧',
      title: 'Experiència en instal·lacions reals',
      desc: "Més d'una dècada gestionant infraestructura tècnica en entorns d'alta demanda: hotels de muntanya, sistemes ACS industrials, climatització sota càrrega contínua. Sabem el que passa a la sala de calderes.",
    },
    {
      icon: '▣',
      title: 'Especialització en dades i automatització',
      desc: "Anàlisi de consums amb dades reals, integració de sensors, automatització amb plataformes com Home Assistant i panells de control que mostren l'estalvi certificat per període.",
    },
    {
      icon: '◈',
      title: 'Independència estructural',
      desc: "No som comercialitzadors ni distribuïdors. No venem maquinari de tercers per marge. L'únic alineament d'incentius possible és que la teva factura baixi.",
    },
    {
      icon: '◫',
      title: 'Especialització sectorial',
      desc: "Hostaleria, restauració, indústria lleugera i retail. Cada sector té patrons de consum diferents i solucions diferents. No apliquem la mateixa recepta a tothom.",
    },
  ],

  eyebrowHow: 'Com treballem',
  titleHow: 'Quatre passos. Sense risc previ.',
  descHow:
    "El procés complet no requereix cap compromís fins que tens els números sobre la taula.",

  steps: [
    {
      num: '01',
      title: 'Diagnòstic',
      desc: "Analitzem les teves factures i el consum real de la teva instal·lació. En 48 hores et diem si hi ha marge, quant és i d'on ve. Sense cost ni compromís.",
    },
    {
      num: '02',
      title: 'Proposta concreta',
      desc: "Pla d'acció amb l'estalvi estimat per mesura, el cost d'implementació i el termini de retorn. Suficient per justificar-ho internament.",
    },
    {
      num: '03',
      title: 'Implementació',
      desc: "Acompanyament en l'execució de cada mesura. Sense paralitzar la teva operativa. Sense interferir en el servei. Amb terminis concrets i lliurables reals.",
    },
    {
      num: '04',
      title: 'Seguiment',
      desc: "Informe mensual amb l'estalvi real del període, no amb projeccions. Si alguna cosa no funciona com s'esperava, ho detectem i actuem.",
    },
  ],

  eyebrowDiff: 'Per què som diferents',
  titleDiff: 'Tres diferències que importen quan parles amb un director financer',
  descDiff:
    "Hi ha moltes consultores que prometen estalvis. Poques que els certifiquin. Menys encara que treballin sense incentiu per vendre't res.",

  diffPoints: [
    {
      icon: '◧',
      title: 'Independència',
      desc: "No som intermediaris de cap comercialitzadora. No rebem comissions de proveïdors. Si no hi ha estalvi real, no hi ha projecte.",
    },
    {
      icon: '▣',
      title: 'Dades reals',
      desc: "Treballem amb mesuraments de consum real, no amb simulacions teòriques. L'informe final reflecteix el que va ocórrer, no el que podria ocórrer.",
    },
    {
      icon: '◈',
      title: 'Sense lletra petita',
      desc: "Honoraris fixos o alineats amb l'estalvi aconseguit. Sense permanències, sense renovacions automàtiques, sense clàusules que et lliguin si els resultats no arriben.",
    },
  ],

  ctaTitle: 'La teva empresa paga més de 3.000 €/mes en electricitat?',
  ctaDesc:
    "Aquest és el llindar a partir del qual l'estalvi potencial justifica una anàlisi seriosa. Envia'ns les teves tres últimes factures. En 48 hores et diem si hi ha marge i quant pots recuperar.",
  ctaButton: "Sol·licita el teu estudi gratuït",
};

export function SobreNosotrosPage({ basePath, lang = 'es' }: SobreNosotrosPageProps) {
  const c = lang === 'ca' ? CA : ES;

  return (
    <div className="flex flex-col bg-background">
      {/* HERO */}
      <SectionHero
        eyebrow={c.eyebrowHero}
        title={c.titleHero}
        subtitle={c.subtitleHero}
        compact
      />

      {/* POR QUÉ EXISTIMOS */}
      <section className="section-shell">
        <div className="section-inner grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionIntro
            eyebrow={c.eyebrowWhy}
            title={c.titleWhy}
            description={c.descWhy}
          />
          <div className="grid gap-4">
            {c.whyPoints.map((p) => (
              <div key={p.title} className="surface-panel-soft p-6">
                <h3 className="font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-foreground/65">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro
            eyebrow={c.eyebrowWho}
            title={c.titleWho}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {c.whoBlocks.map((b) => (
              <div key={b.title} className="surface-panel-soft p-6 flex gap-5">
                <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/65">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS */}
      <section className="section-shell">
        <div className="section-inner">
          <SectionIntro
            eyebrow={c.eyebrowHow}
            title={c.titleHow}
            description={c.descHow}
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {c.steps.map((s) => (
              <div key={s.num} className="surface-panel-soft p-7">
                <p className="font-heading text-5xl font-bold text-primary-100 dark:text-primary-900/40">
                  {s.num}
                </p>
                <h3 className="mt-4 font-heading text-lg font-bold tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ SOMOS DIFERENTES */}
      <section className="section-shell-muted">
        <div className="section-inner">
          <SectionIntro
            eyebrow={c.eyebrowDiff}
            title={c.titleDiff}
            description={c.descDiff}
            align="center"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {c.diffPoints.map((d) => (
              <div key={d.title} className="surface-panel-soft p-8 text-center flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-2xl text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {d.icon}
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-foreground">
                  {d.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-shell-tight pb-24">
        <div className="section-inner">
          <ActionBanner
            title={c.ctaTitle}
            description={c.ctaDesc}
            action={
              <Link href={withBasePath(basePath, '/estudio')} className="cta-primary">
                {c.ctaButton}
              </Link>
            }
          />
        </div>
      </section>
    </div>
  );
}
