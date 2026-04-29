import { NextResponse } from 'next/server';
import { generateWithOpenRouter } from '@/lib/ai/openrouter';
import { checkRateLimit, getClientIp, hashIdentifier } from '@/lib/security';

export const runtime = 'nodejs';

interface SuggestPayload {
  topic?: string;
  locale?: 'es' | 'ca';
}

function fallback(topic: string, locale: 'es' | 'ca') {
  if (locale === 'ca') {
    return {
      subject: `Novetats d'energia: ${topic}`,
      preheader: 'Resum setmanal amb estalvi, domotica i oportunitats.',
      cta: 'Veure novetats',
    };
  }

  return {
    subject: `Novedades de energia: ${topic}`,
    preheader: 'Resumen semanal con ahorro, domotica y oportunidades.',
    cta: 'Ver novedades',
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateKey = hashIdentifier(`ai:${ip}`);
  const rate = await checkRateLimit({
    key: rateKey,
    endpoint: 'ai-newsletter-suggest',
    limit: 20,
    windowMs: 60_000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { message: 'Rate limit excedido' },
      { status: 429, headers: { 'Retry-After': rate.retryAfter.toString() } }
    );
  }

  const body = (await request.json()) as SuggestPayload;
  const locale = body.locale === 'ca' ? 'ca' : 'es';
  const topic = body.topic?.trim() || (locale === 'ca' ? 'estalvi energetic' : 'ahorro energetico');

  const prompt =
    locale === 'ca'
      ? `Genera resposta JSON amb claus subject, preheader i cta per una newsletter sobre: ${topic}. To clar i comercial.`
      : `Genera respuesta JSON con claves subject, preheader y cta para una newsletter sobre: ${topic}. Tono claro y comercial.`;

  const result = await generateWithOpenRouter([
    {
      role: 'system',
      content: 'Responde solo con JSON valido y sin markdown.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]);

  if (!result) {
    return NextResponse.json(fallback(topic, locale));
  }

  try {
    const parsed = JSON.parse(result) as { subject?: string; preheader?: string; cta?: string };
    return NextResponse.json({
      subject: parsed.subject || fallback(topic, locale).subject,
      preheader: parsed.preheader || fallback(topic, locale).preheader,
      cta: parsed.cta || fallback(topic, locale).cta,
    });
  } catch {
    return NextResponse.json(fallback(topic, locale));
  }
}
