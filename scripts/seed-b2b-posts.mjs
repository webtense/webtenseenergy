/**
 * Inserta los 5 artículos B2B en la base de datos.
 * Ejecutar: node scripts/seed-b2b-posts.mjs
 * Simular sin escribir: node scripts/seed-b2b-posts.mjs --dry-run
 */

import { createRequire } from 'module';

const DRY_RUN = process.argv.includes('--dry-run');
const { PrismaClient } = createRequire(import.meta.url)('@prisma/client');
const db = new PrismaClient();

const CATEGORY_NAME = 'Eficiencia Energética B2B';
const CATEGORY_SLUG = 'eficiencia-energetica-b2b';

const posts = [
  {
    slug: 'como-detectar-potencia-contratada-excesiva',
    seoTitle: 'Cómo detectar si tu empresa paga demasiada potencia contratada | Webtense Energy',
    seoDescription:
      'La potencia contratada es uno de los errores más caros y silenciosos en las facturas de empresas. Aprende a detectarlo sin necesidad de ninguna herramienta.',
    title: 'Cómo detectar si tu empresa está pagando demasiada potencia contratada',
    excerpt:
      'La potencia contratada es uno de los costes más opacos de cualquier factura eléctrica. Se paga siempre, uses o no la energía, y rara vez alguien la revisa. Aquí te explicamos cómo detectar si estás pagando de más.',
    content: `<p>La potencia contratada es el importe que pagas simplemente por tener acceso a la red eléctrica, independientemente de si consumes o no. En tarifas 3.0TD y 6.X, se contrata en varios periodos (P1 a P6) y puede representar entre el 30% y el 50% de la factura total.</p>

<h2>El problema habitual</h2>
<p>La mayoría de empresas llevan años con la misma potencia contratada que se fijó cuando instalaron el suministro. Nadie la revisa porque la factura llega, se aprueba y se paga. El resultado: muchas empresas pagan por una potencia que nunca usan en determinados periodos, o acumulan penalizaciones por exceder la potencia en otros.</p>

<h2>Señales de que algo está mal</h2>
<ul>
  <li><strong>Línea de "excesos de potencia" en la factura con importe recurrente.</strong> Si aparece mes tras mes, la potencia contratada en ese periodo es insuficiente.</li>
  <li><strong>Potencias uniformes en todos los periodos.</strong> En la mayoría de negocios, el consumo en P3–P6 (noches y festivos) es muy inferior a P1–P2. Tener la misma potencia en todos es casi siempre un error.</li>
  <li><strong>No haber revisado el contrato en más de dos años.</strong> Las tarifas cambian, la regulación cambia y el consumo de tu negocio también.</li>
</ul>

<h2>Cómo comprobarlo tú mismo</h2>
<p>Con la factura en mano, busca la tabla de potencias contratadas y compárala con la columna de maxímetro (potencia máxima demandada). Si en algún periodo la demandada es sistemáticamente inferior al 50% de la contratada, probablemente puedes ajustarla a la baja sin riesgo.</p>
<p>Ten en cuenta que bajar la potencia tiene límites: si luego la superas, las penalizaciones pueden ser elevadas. Por eso el ajuste debe hacerse con datos reales de al menos 12 meses, no con estimaciones.</p>

<h2>Qué se puede ahorrar</h2>
<p>En negocios con facturas entre 3.000 y 15.000 €/mes, la optimización de potencias contratadas suele generar entre 400 y 1.200 €/mes de ahorro sin ninguna inversión técnica. Solo gestión contractual.</p>

<h2>Siguiente paso</h2>
<p>Si tienes dudas sobre tu situación actual, envíanos tus últimas 3 facturas. En 48 horas te decimos exactamente si hay margen y cuánto puedes esperar ahorrar.</p>`,
  },
  {
    slug: 'errores-energeticos-frecuentes-en-hoteles',
    seoTitle: 'Los 5 errores energéticos más frecuentes en hoteles | Webtense Energy',
    seoDescription:
      'Los hoteles tienen un perfil de consumo complejo que genera ineficiencias muy específicas. Estos son los errores que vemos con más frecuencia y cómo se corrigen.',
    title: 'Los 5 errores energéticos más frecuentes en hoteles',
    excerpt:
      'Los hoteles tienen un perfil de consumo complejo: climatización, agua caliente, cocina, iluminación y zonas comunes operando a distintos ritmos. Esta complejidad genera ineficiencias muy específicas que los equipos de mantenimiento raramente detectan solos.',
    content: `<p>En más de un año auditando instalaciones hoteleras, los mismos errores aparecen una y otra vez. No porque los equipos de mantenimiento sean malos, sino porque sin datos reales por zonas y sin alguien que mire la factura desde fuera, es imposible verlos.</p>

<h2>1. Climatización sin gestión de ocupación</h2>
<p>El sistema funciona por horario fijo: de las 7h a las 23h, a temperatura constante, en todas las zonas. En temporada baja, zonas vacías climatizadas igual que en agosto. En un hotel de 80 habitaciones, esto puede representar entre el 25 y el 35% del consumo de climatización desperdiciado.</p>
<p><strong>Solución:</strong> Vincular la climatización de habitaciones al PMS. En zonas comunes, activar perfiles de temperatura por franja horaria y por ocupación real.</p>

<h2>2. Potencia contratada desajustada</h2>
<p>Los hoteles tienen picos de demanda muy marcados (check-in, desayuno, spa en temporada alta) y valles profundos (madrugada, temporada baja). Mantener la misma potencia para ambas situaciones genera o excesos de potencia o capacidad contratada inutilizada.</p>
<p><strong>Solución:</strong> Revisar los maxímetros de los últimos 12 meses y ajustar periodo a periodo. En muchos casos el ahorro es inmediato y sin inversión.</p>

<h2>3. Sin subcontadores por zonas</h2>
<p>Un único contador para todo el hotel hace imposible identificar qué zona consume qué. Cuando llega la factura, nadie sabe si el incremento vino del spa, de la cocina o de un problema en la climatización de una planta. El mantenimiento se hace por estimación, no por datos.</p>
<p><strong>Solución:</strong> Instalar monitorización por zonas (cocina, spa, habitaciones, zonas comunes). La inversión es baja y el retorno en información es inmediato.</p>

<h2>4. Agua caliente sanitaria sin gestión horaria</h2>
<p>Los acumuladores de ACS trabajan en ciclos constantes, incluyendo franjas de precio máximo. En hoteles con consumo elevado de ACS, mover los ciclos de calentamiento a horas valle puede suponer un 15–20% de ahorro en ese coste.</p>
<p><strong>Solución:</strong> Programar los ciclos de calentamiento en periodos P3–P6 y mantener una guardia térmica mínima en P1–P2.</p>

<h2>5. Iluminación de zonas comunes sin control</h2>
<p>Pasillos, aparcamientos, zonas exteriores y salas de reuniones con iluminación al 100% durante horas de baja o nula ocupación. En muchos casos, la sustitución a LED ya está hecha, pero falta el segundo paso: control inteligente.</p>
<p><strong>Solución:</strong> Sensores de presencia en pasillos y baños de zonas comunes. Regulación de intensidad en exteriores según horario solar.</p>

<h2>¿Tu hotel tiene alguno de estos problemas?</h2>
<p>Si tu factura mensual supera los 3.000 €/mes, podemos hacer un análisis previo gratuito en 48 horas. Sin visita previa, sin compromiso.</p>`,
  },
  {
    slug: 'que-revisar-antes-de-instalar-placas-solares-en-un-negocio',
    seoTitle: 'Qué revisar antes de instalar placas solares en tu negocio | Webtense Energy',
    seoDescription:
      'Instalar fotovoltaico sin haber optimizado el consumo base es uno de los errores más caros en energía empresarial. Estos son los pasos previos imprescindibles.',
    title: 'Qué revisar antes de instalar placas solares en tu negocio',
    excerpt:
      'Instalar fotovoltaico sin haber optimizado el consumo base es uno de los errores más caros que cometen las empresas. El retorno se calcula sobre el consumo actual, y si ese consumo tiene ineficiencias, el cálculo es incorrecto.',
    content: `<p>La energía solar fotovoltaica es una decisión de inversión, no solo una apuesta por la sostenibilidad. Y como toda inversión, el retorno depende de cuánto pagas ahora y de cuánto puedes reducir ese coste. Si partes de un consumo ineficiente, el ROI real será peor que el proyectado.</p>

<h2>El error más frecuente</h2>
<p>Un instalador de fotovoltaico calcula el retorno basándose en la factura actual. Si esa factura incluye excesos de potencia, consumo fuera de horario optimizado o equipos sobredimensionados, el cálculo es correcto en el papel pero parte de una base que puede mejorarse. Resultado: instalas más paneles de los que necesitarías y el retorno real se alarga.</p>

<h2>Paso 1: Audita el consumo base antes de nada</h2>
<p>Antes de hablar con ningún instalador, conoce tu consumo real por zonas y por franjas horarias. Identifica:</p>
<ul>
  <li>Qué porcentaje de tu consumo ocurre durante el día (cuando la solar produce)</li>
  <li>Qué equipos podrías desplazar a horas de producción solar</li>
  <li>Qué ineficiencias puedes eliminar antes de dimensionar la instalación</li>
</ul>

<h2>Paso 2: Optimiza la potencia contratada</h2>
<p>Con fotovoltaico, la gestión de potencias contratadas cambia. En algunos periodos, tu demanda neta de red bajará significativamente. Si no ajustas la potencia contratada después de instalar, seguirás pagando por capacidad que ya no necesitas en esas franjas.</p>

<h2>Paso 3: Evalúa la tarifa objetivo</h2>
<p>No todas las tarifas aprovechan igual la generación solar. Las tarifas con discriminación horaria pueden maximizar el ahorro si combinas autoconsumo con desplazamiento de cargas. Vale la pena comparar escenarios antes de firmar un contrato a largo plazo con tu comercializadora actual.</p>

<h2>Paso 4: Dimensiona con datos, no con promedios</h2>
<p>El dimensionado correcto de una instalación fotovoltaica requiere datos de consumo horarios (curva de carga), no solo la factura mensual. Pide siempre los datos de tu distribuidora (disponibles en CUPS) antes de aceptar cualquier presupuesto.</p>

<h2>Paso 5: Considera el almacenamiento solo si el autoconsumo supera el 70%</h2>
<p>Las baterías tienen sentido cuando tu perfil de consumo no coincide bien con las horas de producción solar. Si consumes principalmente de noche o en fines de semana, pueden ser interesantes. Si consumes mayoritariamente de día, probablemente no justifican la inversión adicional hoy.</p>

<h2>¿Por dónde empezar?</h2>
<p>Si tu factura supera los 3.000 €/mes, el primer paso es siempre el análisis. Envíanos tus últimas 3 facturas y en 48 horas te decimos qué optimizaciones previas tienen más impacto y qué tamaño de instalación solar tendría más sentido para tu perfil.</p>`,
  },
  {
    slug: 'como-reducir-consumo-hvac-sin-afectar-al-confort',
    seoTitle: 'Cómo reducir el consumo HVAC sin afectar al confort | Webtense Energy',
    seoDescription:
      'La climatización puede representar entre el 40 y el 60% del consumo eléctrico de un negocio. Estas son las medidas que generan ahorro real sin tocar el confort de clientes o empleados.',
    title: 'Cómo reducir el consumo HVAC sin afectar al confort',
    excerpt:
      'La climatización puede representar entre el 40 y el 60% del consumo eléctrico de un negocio. La mayoría de ese consumo no es inevitable: es el resultado de sistemas mal configurados, sin datos y sin gestión activa.',
    content: `<p>Cuando hablamos de reducir consumo en climatización, la primera reacción suele ser la misma: "no podemos bajar la temperatura en verano ni subirla en invierno, los clientes se quejarían". Eso es cierto. Pero ese no es el problema. El problema es que los sistemas funcionan al mismo nivel cuando el espacio está lleno que cuando está vacío.</p>

<h2>Por qué la climatización consume tanto</h2>
<p>Los sistemas HVAC comerciales están dimensionados para la situación de máxima demanda: el día más caluroso del año con el local al 100% de ocupación. El resto del tiempo —que es la mayor parte del año— trabajan por encima de lo necesario porque nadie les ha dicho que la situación ha cambiado.</p>

<h2>Medida 1: Gestión por ocupación real</h2>
<p>La medida con mayor impacto y menor inversión es vincular el funcionamiento del sistema a datos de ocupación. En hoteles, esto se puede hacer con el PMS. En oficinas, con sensores de CO2 o presencia. En restauración, con el calendario de reservas.</p>
<p>El objetivo no es reducir el confort cuando hay gente, sino dejar de mantener condiciones óptimas cuando no hay nadie.</p>
<p><strong>Ahorro típico:</strong> 20–35% en consumo de climatización.</p>

<h2>Medida 2: Setpoints diferenciados por zona y horario</h2>
<p>No todas las zonas de un negocio tienen las mismas necesidades. Una sala de reuniones que se usa tres horas al día no necesita estar a 22°C las otras 21 horas. Un almacén no necesita las mismas condiciones que una sala de ventas.</p>
<p>Definir setpoints diferenciados por zona y activar preacondicionamiento solo antes de la ocupación puede reducir el consumo base de forma significativa sin que nadie lo note.</p>

<h2>Medida 3: Mantenimiento predictivo, no programado</h2>
<p>Los filtros sucios, las bombas de calor con gas bajo y los intercambiadores sin limpiar consumen entre un 10 y un 25% más que los mismos equipos en buen estado. El mantenimiento preventivo por calendario ignora esto: se hace cada X meses independientemente del estado real del equipo.</p>
<p>Con monitorización de consumo por zonas, es posible detectar cuándo un equipo empieza a trabajar más de lo normal antes de que falle o antes de que alguien lo note.</p>

<h2>Medida 4: Integración con precio horario de la electricidad</h2>
<p>En tarifas indexadas o con discriminación horaria, los picos de precio ocurren en franjas predecibles. Para negocios con inercia térmica suficiente (hoteles, industria), es posible precondicionar espacios en horas baratas y reducir la demanda de climatización en horas caras.</p>
<p>Esta estrategia requiere automatización, pero el retorno puede ser importante en instalaciones grandes.</p>

<h2>¿Cuánto se puede ahorrar?</h2>
<p>En las instalaciones que hemos auditado, la combinación de gestión por ocupación + setpoints diferenciados + mantenimiento basado en datos genera reducciones del 25–40% en consumo de climatización. Sin obras, sin cambiar equipos, sin afectar al confort.</p>
<p>Si tu factura supera los 3.000 €/mes, te podemos dar una estimación concreta en 48 horas.</p>`,
  },
  {
    slug: 'que-debe-incluir-una-auditoria-energetica-util',
    seoTitle: 'Qué debe incluir una auditoría energética útil para empresas | Webtense Energy',
    seoDescription:
      'No todas las auditorías energéticas son iguales. Muchas son documentos genéricos que no llevan a ninguna acción. Esto es lo que debe incluir una auditoría que sirva para algo.',
    title: 'Qué debe incluir una auditoría energética útil (y qué debe evitar)',
    excerpt:
      'Una auditoría energética que no lleva a ninguna acción concreta es papel mojado. El mercado está lleno de informes genéricos que listan recomendaciones sin priorizar, sin cifrar el impacto y sin un plan de implementación. Esto es lo que distingue una auditoría útil de una que no lo es.',
    content: `<p>El objetivo de una auditoría energética es simple: saber exactamente dónde se gasta la energía, cuánto cuesta cada ineficiencia y en qué orden conviene actuar. Si el informe final no responde a esas tres preguntas con cifras concretas, no es útil.</p>

<h2>Lo que una auditoría debe incluir obligatoriamente</h2>

<h3>1. Análisis de facturación histórica (mínimo 12 meses)</h3>
<p>Sin datos históricos no hay contexto. La auditoría debe identificar la evolución de la factura, la estacionalidad del consumo, las variaciones anómalas y la comparativa entre periodos. Con menos de 12 meses, los patrones estacionales son invisibles.</p>

<h3>2. Inventario de consumos por zonas y equipos</h3>
<p>La auditoría debe desagregar el consumo total en sus componentes: climatización, iluminación, producción, procesos, equipos auxiliares. Sin esta desagregación, no es posible priorizar ni estimar el impacto de cada medida.</p>

<h3>3. Curva de carga horaria</h3>
<p>Saber cuánto se consume en total no es suficiente. Es necesario saber cuándo se consume. La curva horaria revela si hay consumo nocturno anómalo, si los picos coinciden con las horas más caras y si hay margen para desplazar cargas.</p>

<h3>4. Identificación de ineficiencias con impacto económico cuantificado</h3>
<p>Cada problema detectado debe ir acompañado de su coste anual estimado. No basta con decir "la potencia contratada está sobredimensionada": hay que decir "está pagando X €/mes de más en el periodo P2 y puede reducirse sin riesgo de penalización".</p>

<h3>5. Plan de medidas priorizado por retorno</h3>
<p>Las medidas deben ordenarse por relación impacto/inversión, no por orden técnico o de facilidad. Las que no requieren inversión van primero. Las que tienen retorno en menos de 12 meses van antes que las que tardan 4 años.</p>

<h3>6. Estimación de ahorro por medida</h3>
<p>Cada medida debe tener una estimación de ahorro anual, una estimación de inversión y un retorno aproximado. Las estimaciones deben basarse en los datos reales de la instalación, no en medias sectoriales.</p>

<h2>Lo que debe evitar una auditoría seria</h2>
<ul>
  <li><strong>Recomendaciones genéricas sin cuantificar</strong> ("mejorar el aislamiento", "revisar la eficiencia de los equipos")</li>
  <li><strong>Secciones copiadas de informes anteriores</strong> que no hacen referencia a datos concretos de la instalación</li>
  <li><strong>Ausencia de plan de implementación</strong>: qué hacer primero, qué requiere inversión y cuándo esperar resultados</li>
  <li><strong>Informes sin fecha de seguimiento</strong>: una auditoría sin seguimiento es una foto fija que caduca en meses</li>
</ul>

<h2>La diferencia entre una auditoría y un análisis previo</h2>
<p>En Webtense Energy distinguimos entre el análisis previo (gratuito, basado en facturas, en 48 horas) y la auditoría técnica completa (con visita a la instalación, medición real y plan detallado). El análisis previo sirve para decidir si vale la pena ir más lejos. La auditoría sirve para implementar.</p>
<p>Si tu factura supera los 3.000 €/mes, empieza por el análisis previo. Sin coste, sin compromiso, con cifras reales.</p>`,
  },
];

async function main() {
  console.log(`Modo: ${DRY_RUN ? 'DRY RUN (sin cambios)' : 'ESCRITURA REAL'}\n`);

  // Crear categoría si no existe
  let category = await db.category.findUnique({ where: { slug: CATEGORY_SLUG } });
  if (!category) {
    if (!DRY_RUN) {
      category = await db.category.create({
        data: { slug: CATEGORY_SLUG, name: CATEGORY_NAME, locale: 'ES' },
      });
      console.log(`✓ Categoría creada: ${CATEGORY_NAME}`);
    } else {
      console.log(`[DRY] Crearía categoría: ${CATEGORY_NAME}`);
    }
  } else {
    console.log(`→ Categoría ya existe: ${CATEGORY_NAME}`);
  }

  for (const p of posts) {
    const existing = await db.post.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`→ Ya existe: ${p.slug}`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`[DRY] Crearía post: ${p.title}`);
      continue;
    }

    const post = await db.post.create({
      data: {
        slug: p.slug,
        status: 'REVIEW',
        locale: 'ES',
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        publishedAt: null,
        translations: {
          create: {
            locale: 'ES',
            title: p.title,
            excerpt: p.excerpt,
            content: p.content,
          },
        },
        ...(category
          ? { categories: { create: { categoryId: category.id } } }
          : {}),
      },
    });

    console.log(`✓ Creado: ${post.slug}`);
  }

  console.log('\nFinalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
