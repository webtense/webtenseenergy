import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hasValidCronBearer, unauthorizedMachineResponse } from '@/lib/machine-auth';
import { generateWithOpenRouter } from '@/lib/ai/openrouter';

export const runtime = 'nodejs';

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
    const body = (await request.json()) as { topic?: string; locale?: string };
    const topic = body.topic?.trim();
    const locale = (body.locale?.toUpperCase() ?? 'ES') as 'ES';

    if (!topic) {
      return NextResponse.json({ error: 'El campo "topic" es obligatorio' }, { status: 400 });
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

Tema: ${topic}
Año actual: 2026. Toda la información, cifras, normativas y referencias deben ser de 2026. NUNCA menciones 2025 como año actual o vigente.
Público objetivo: Directores de operaciones, gerentes financieros y responsables de mantenimiento de empresas con facturas eléctricas superiores a 3.000 €/mes.
CTA final: Invitar a solicitar un análisis energético gratuito en /estudio.

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
- 800-1200 palabras.
- Estructura: introducción → problema → solución detallada → caso práctico o datos → conclusión + CTA.
- Tono: técnico, claro, orientado a la toma de decisiones empresariales.
- Enfocado en energía B2B: auditorías, ahorro, solar, tarifas, HVAC para empresas.

Reglas para los demás campos:
- title: concreto, SEO-friendly, orientado a ahorro o eficiencia B2B.
- excerpt: 1-2 frases que resuman el valor del artículo (máx. 180 caracteres).
- seoTitle: hasta 60 caracteres.
- seoDescription: entre 120 y 155 caracteres.
- slug: URL amigable en español, sin tildes, con guiones.
- category: una de estas categorías: Ahorro Energético | Energía Solar | Tarifas Eléctricas | Eficiencia HVAC | Auditoría Energética | Regulación y Normativa.`,
      },
    ]);

    if (!raw) {
      return NextResponse.json({ error: 'No se pudo generar el artículo con IA' }, { status: 500 });
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
      logger.error('IA devolvió JSON inválido en blog/create');
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'La respuesta de la IA no pudo parsearse' },
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
      create: { slug: catSlug, name: catName, locale },
      update: { name: catName },
    });

    const author = await db.adminUser.findFirst({ where: { role: 'ADMIN' } });

    const post = await db.post.create({
      data: {
        slug: finalSlug,
        status: 'DRAFT',
        locale,
        seoTitle: draft.seoTitle.slice(0, 70) || null,
        seoDescription: draft.seoDescription.slice(0, 160) || null,
        authorId: author?.id ?? null,
        translations: {
          create: {
            locale,
            title: draft.title,
            excerpt: draft.excerpt,
            content: draft.content,
          },
        },
        categories: { create: { categoryId: category.id } },
      },
    });

    logger.info(
      { postId: post.id, slug: finalSlug, topic },
      'Post DRAFT creado via blog automation'
    );

    return NextResponse.json({
      ok: true,
      post: {
        id: post.id,
        title: draft.title,
        slug: finalSlug,
        status: 'DRAFT',
        adminUrl: 'https://webtenseenergy.com/admin/posts',
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error en blog/create');
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
