import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hasValidCronBearer, unauthorizedMachineResponse } from '@/lib/machine-auth';
import { generateWithOpenRouter } from '@/lib/ai/openrouter';

export const runtime = 'nodejs';

export const PROPOSALS_KEY = '_blog_proposals_pending';
const PROPOSALS_TTL_MS = 23 * 60 * 60 * 1000;

type Proposal = { id: number; title: string; brief: string };

const FALLBACK: Proposal[] = [
  {
    id: 1,
    title: 'Cómo reducir la factura eléctrica de tu hotel en 90 días',
    brief: 'Caso práctico con acciones concretas y ROI documentado.',
  },
  {
    id: 2,
    title: 'Penalizaciones por exceso de potencia: cómo detectarlas y eliminarlas',
    brief: 'Guía técnica para revisar el contrato eléctrico B2B.',
  },
  {
    id: 3,
    title: 'Automatización HVAC: climatización inteligente según ocupación',
    brief: 'Cómo vincular la climatización al PMS para ahorrar hasta un 34%.',
  },
  {
    id: 4,
    title: 'Monitorización energética por zonas: qué medir y cómo actuar',
    brief: 'Qué instalar, qué datos analizar y cómo priorizar las intervenciones.',
  },
  {
    id: 5,
    title: 'Discriminación horaria en tarifas B2B: ahorra sin invertir',
    brief: 'Cómo optimizar el contrato eléctrico sin obras ni cambio de suministrador.',
  },
];

export async function POST(request: Request) {
  if (!hasValidCronBearer(request)) {
    return unauthorizedMachineResponse();
  }

  const raw = await generateWithOpenRouter([
    {
      role: 'system',
      content:
        'Eres editor senior de Webtense Energy. Respondes solo con JSON válido, sin markdown ni texto adicional.',
    },
    {
      role: 'user',
      content: `Genera 5 propuestas de artículo para el blog de Webtense Energy (consultoría energética B2B: hoteles, restaurantes, empresas con factura >3.000€/mes).

Devuelve exactamente este JSON:
{"proposals":[{"id":1,"title":"...","brief":"..."},{"id":2,"title":"...","brief":"..."},{"id":3,"title":"...","brief":"..."},{"id":4,"title":"...","brief":"..."},{"id":5,"title":"...","brief":"..."}]}

Reglas:
- Títulos concretos, SEO-friendly, orientados a ahorro energético B2B.
- Brief de 1 frase (enfoque o ángulo del artículo).
- Varía entre: casos prácticos, guías técnicas, análisis de costes, automatización, regulación.`,
    },
  ]);

  let proposals: Proposal[] = FALLBACK;

  if (raw) {
    try {
      const cleaned = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
      const parsed = JSON.parse(cleaned) as { proposals?: Proposal[] };
      if (Array.isArray(parsed.proposals) && parsed.proposals.length >= 5) {
        proposals = parsed.proposals.slice(0, 5).map((p, i) => ({ ...p, id: i + 1 }));
      }
    } catch {
      logger.warn('Gemini devolvió JSON inválido en blog/propose, usando fallback');
    }
  }

  await db.siteSetting.upsert({
    where: { key: PROPOSALS_KEY },
    create: {
      key: PROPOSALS_KEY,
      value: JSON.stringify({ proposals, createdAt: new Date().toISOString() }),
    },
    update: {
      value: JSON.stringify({ proposals, createdAt: new Date().toISOString() }),
    },
  });

  logger.info({ count: proposals.length }, 'Propuestas de blog generadas y guardadas');
  return NextResponse.json({ ok: true, proposals, ttlMs: PROPOSALS_TTL_MS });
}
