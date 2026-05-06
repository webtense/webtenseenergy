import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hasValidCronBearer, unauthorizedMachineResponse } from '@/lib/machine-auth';
import { generateWithOpenRouter } from '@/lib/ai/openrouter';

export const runtime = 'nodejs';

const PROPOSALS_KEY = '_blog_proposals_pending';
const PROPOSALS_TTL_MS = 23 * 60 * 60 * 1000;

type Proposal = { id: number; title: string; brief: string };

type GeneratedDraft = {
  title: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  category: string;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function stripJsonFences(value: string) {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

export async function POST(request: Request) {
  if (!hasValidCronBearer(request)) {
    return unauthorizedMachineResponse();
  }

  try {
    const body = (await request.json()) as { choice?: number };
    const choice = Number(body.choice);

    if (!choice || choice < 1 || choice > 5) {
      return NextResponse.json({ error: 'choice debe ser un número del 1 al 5' }, { status: 400 });
    }

    const setting = await db.siteSetting.findUnique({ where: { key: PROPOSALS_KEY } });
    if (!setting) {
      return NextResponse.json({ error: 'No hay propuestas pendientes' }, { status: 404 });
    }

    const { proposals, createdAt } = JSON.parse(setting.value) as {
      proposals: Proposal[];
      createdAt: string;
    };

    if (Date.now() - new Date(createdAt).getTime() > PROPOSALS_TTL_MS) {
      await db.siteSetting.delete({ where: { key: PROPOSALS_KEY } });
      return NextResponse.json({ error: 'Las propuestas han caducado (>23h)' }, { status: 410 });
    }

    const chosen = proposals.find((p) => p.id === choice);
    if (!chosen) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 });
    }

    const raw = await generateWithOpenRouter([
      {
        role: 'system',
        content:
          'Eres editor senior de Webtense Energy. Respondes solo con JSON válido, sin markdown ni texto adicional.',
      },
      {
        role: 'user',
        content: `Genera un artículo completo para el blog de Webtense Energy en español.

Título base: ${chosen.title}
Enfoque: ${chosen.brief}
Público objetivo: Directores de operaciones, gerentes financieros y responsables de mantenimiento con facturas eléctricas >3.000€/mes.
CTA final: Invitar a solicitar análisis energético gratuito en /estudio.

Devuelve exactamente este JSON (sin texto fuera del JSON):
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "slug": "...",
  "category": "..."
}

Reglas para content:
- HTML limpio con <p>, <h2>, <h3>, <ul>, <li>, <strong>.
- Sin markdown ni code blocks.
- 600-900 palabras.
- Estructura: intro → problema → solución → caso/ejemplo → conclusión + CTA.
- Tono: claro, técnico, orientado a decisión empresarial.`,
      },
    ]);

    if (!raw) {
      return NextResponse.json(
        { error: 'No se pudo generar el artículo con Gemini' },
        { status: 500 }
      );
    }

    let draft: GeneratedDraft | null = null;
    try {
      const parsed = JSON.parse(stripJsonFences(raw)) as Partial<GeneratedDraft>;
      if (parsed.title && parsed.content) {
        draft = {
          title: parsed.title.trim(),
          excerpt: parsed.excerpt?.trim() || '',
          content: parsed.content.trim(),
          seoTitle: parsed.seoTitle?.trim() || parsed.title.trim(),
          seoDescription: parsed.seoDescription?.trim() || parsed.excerpt?.trim() || '',
          slug: parsed.slug?.trim() || '',
          category: parsed.category?.trim() || 'Ahorro Energético',
        };
      }
    } catch {
      logger.error('Gemini devolvió JSON inválido en blog/create');
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'La respuesta de Gemini no pudo parsearse' },
        { status: 500 }
      );
    }

    const slug = toSlug(draft.slug || draft.title);
    const existing = await db.post.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const catName = draft.category;
    const catSlug = toSlug(catName);
    const category = await db.category.upsert({
      where: { slug: catSlug },
      create: { slug: catSlug, name: catName, locale: 'ES' },
      update: { name: catName },
    });

    const author = await db.adminUser.findFirst({ where: { role: 'ADMIN' } });

    const post = await db.post.create({
      data: {
        slug: finalSlug,
        status: 'REVIEW',
        locale: 'ES',
        seoTitle: draft.seoTitle.slice(0, 70) || null,
        seoDescription: draft.seoDescription.slice(0, 160) || null,
        authorId: author?.id ?? null,
        translations: {
          create: {
            locale: 'ES',
            title: draft.title,
            excerpt: draft.excerpt,
            content: draft.content,
          },
        },
        categories: { create: { categoryId: category.id } },
      },
    });

    await db.siteSetting.delete({ where: { key: PROPOSALS_KEY } });

    logger.info(
      { postId: post.id, slug: finalSlug, chosenTitle: chosen.title },
      'Post creado via blog automation'
    );

    return NextResponse.json({
      ok: true,
      post: {
        id: post.id,
        title: draft.title,
        slug: finalSlug,
        status: 'REVIEW',
        adminUrl: 'https://webtenseenergy.com/admin/posts',
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error en blog/create');
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
