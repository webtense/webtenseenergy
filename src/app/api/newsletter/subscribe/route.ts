import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp, hashIdentifier, normalizeEmail } from '@/lib/security';
import { SubscribeSchema } from '@/lib/schemas/public';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const rate = await checkRateLimit({
      key: hashIdentifier(getClientIp(request)),
      endpoint: 'newsletter-subscribe',
      limit: 12,
      windowMs: 10 * 60 * 1000,
    });
    if (!rate.allowed) {
      return NextResponse.json({ message: 'Demasiadas solicitudes.' }, { status: 429 });
    }

    const body = await request.json();
    const result = SubscribeSchema.safeParse({
      ...body,
      email: typeof body.email === 'string' ? normalizeEmail(body.email) : body.email,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0]?.message ?? 'Datos inválidos' },
        { status: 400 }
      );
    }

    const { email, fullName, locale } = result.data;

    const subscriber = await db.subscriber.upsert({
      where: { email },
      create: {
        email,
        fullName: fullName?.trim() || null,
        locale,
        source: 'web_footer',
        consentedAt: new Date(),
        isActive: true,
      },
      update: {
        isActive: true,
        unsubscribedAt: null,
        consentedAt: new Date(),
        locale,
      },
    });

    await db.consent.create({
      data: {
        subscriberId: subscriber.id,
        legalText:
          'Acepto recibir comunicaciones de Webtense Energy y puedo darme de baja en cualquier momento.',
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'Te has registrado correctamente. Te avisaremos cuando activemos la newsletter.',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error registrando newsletter');
    return NextResponse.json(
      { message: 'No se pudo registrar la suscripcion. Intentalo de nuevo.' },
      { status: 500 }
    );
  }
}
