import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hasValidCronBearer, unauthorizedMachineResponse } from '@/lib/machine-auth';
import { generateWithOpenRouter } from '@/lib/ai/openrouter';

export const runtime = 'nodejs';

const TOPIC_POOL: string[] = [
  'Cómo reducir la factura eléctrica de tu hotel en 90 días',
  'Penalizaciones por exceso de potencia contratada: cómo detectarlas y eliminarlas',
  'Automatización HVAC: climatización inteligente según ocupación en hoteles y restaurantes',
  'Monitorización energética por zonas: qué medir y cómo priorizar las intervenciones',
  'Discriminación horaria en tarifas B2B: ahorra sin invertir ni cambiar de suministrador',
  'Auditoría energética en PYMES: qué incluye, cuánto cuesta y qué ROI esperar',
  'Instalación de placas solares en empresas: guía práctica para directores financieros',
  'Tarifa indexada vs tarifa fija: cuál conviene en 2025 según tu perfil de consumo',
  'Compensación de reactiva: qué es, por qué penaliza y cómo corregirla',
  'Gestión de demanda eléctrica: cómo evitar picos que disparan tu factura',
  'Certificado energético para empresas: obligaciones, plazos y ayudas disponibles',
  'Comunidades energéticas para empresas: cómo unirte y cuánto puedes ahorrar',
  'Autoconsumo colectivo en polígonos industriales: modelo y beneficios reales',
  'Baterías de almacenamiento para empresas: cuándo rentabilizan la inversión',
  'Eficiencia energética en el sector hostelero: los 5 focos de gasto oculto',
  'Contrato de suministro eléctrico B2B: cláusulas que debes revisar antes de firmar',
  'Subvenciones y deducciones fiscales para eficiencia energética en empresas (2025)',
  'Iluminación LED industrial: cálculo de ahorro y periodo de retorno',
  'Sistemas de gestión energética ISO 50001: guía de implantación para empresas medianas',
  'Caldera de biomasa vs bomba de calor: análisis de costes para instalaciones hosteleras',
];

/**
 * GET /api/automation/blog/propose
 * Devuelve un único tema B2B no publicado recientemente para generar un artículo.
 */
export async function GET(request: Request) {
  if (!hasValidCronBearer(request)) {
    return unauthorizedMachineResponse();
  }

  try {
    // Obtener títulos de los últimos 30 posts para evitar duplicados
    const recentPosts = await db.post.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          where: { locale: 'ES' },
          select: { title: true },
        },
      },
    });

    const recentTitles = recentPosts
      .flatMap((p) => p.translations.map((t) => t.title.toLowerCase()))
      .filter(Boolean);

    // Filtrar temas del pool que no aparezcan en posts recientes
    const available = TOPIC_POOL.filter((topic) => {
      const topicLower = topic.toLowerCase();
      return !recentTitles.some(
        (title) =>
          title.includes(topicLower.slice(0, 30)) || topicLower.includes(title.slice(0, 30))
      );
    });

    const candidatePool = available.length > 0 ? available : TOPIC_POOL;

    // Intentar que la IA elija o adapte el mejor tema del día
    const poolStr = candidatePool.map((t, i) => `${i + 1}. ${t}`).join('\n');

    const raw = await generateWithOpenRouter([
      {
        role: 'system',
        content:
          'Eres editor senior de Webtense Energy. Respondes solo con JSON válido, sin markdown ni texto adicional.',
      },
      {
        role: 'user',
        content: `Elige los 3 temas más relevantes y oportunos para el blog B2B de Webtense Energy hoy.
Público objetivo: Directores de operaciones, gerentes financieros y responsables de mantenimiento con facturas eléctricas >3.000€/mes.

Temas disponibles:
${poolStr}

Puedes adaptar ligeramente los enunciados para hacerlos más concretos o actuales, pero mantén el enfoque B2B energético.

Devuelve exactamente este JSON con 3 opciones distintas:
{"topics": ["...", "...", "..."]}

Reglas:
- Cada topic debe ser un título de artículo concreto, SEO-friendly y orientado a ahorro o eficiencia energética B2B.
- Máximo 100 caracteres por título.
- Sin signos de interrogación.
- Los 3 temas deben ser variados (no todos del mismo subtema).`,
      },
    ]);

    // Fallback: 3 temas aleatorios del pool
    const shuffle = [...candidatePool].sort(() => Math.random() - 0.5);
    const fallbackTopics = shuffle.slice(0, 3);
    let topics: string[] = fallbackTopics;

    if (raw) {
      try {
        const cleaned = raw
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```$/i, '')
          .trim();
        const parsed = JSON.parse(cleaned) as { topics?: string[]; topic?: string };
        if (Array.isArray(parsed.topics) && parsed.topics.length >= 2) {
          topics = parsed.topics
            .slice(0, 3)
            .map((t: string) => t.trim())
            .filter((t) => t.length > 10);
        } else if (parsed.topic && parsed.topic.length > 10) {
          topics = [parsed.topic.trim(), ...fallbackTopics.slice(1)];
        }
      } catch {
        logger.warn('IA devolvió JSON inválido en blog/propose, usando fallback aleatorio');
      }
    }

    logger.info({ topics }, 'Temas del día seleccionados para blog automation');
    return NextResponse.json({ ok: true, topics, topic: topics[0] });
  } catch (error) {
    logger.error({ err: error }, 'Error en blog/propose');
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
