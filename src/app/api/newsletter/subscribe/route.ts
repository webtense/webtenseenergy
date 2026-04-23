import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  checkRateLimit,
  getClientIp,
  hashIdentifier,
  isValidEmail,
  normalizeEmail,
} from '@/lib/security';

export const runtime = 'nodejs';

interface SubscribePayload {
  email?: string;
  consent?: boolean;
  fullName?: string;
  locale?: 'ES' | 'CA';
}

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

    const body = (await request.json()) as SubscribePayload;
    const email = normalizeEmail(body.email || '');

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: 'Email no valido.' }, { status: 400 });
    }

    if (!body.consent) {
      return NextResponse.json({ message: 'Debes aceptar el consentimiento.' }, { status: 400 });
    }

    const subscriber = await db.subscriber.upsert({
      where: { email },
      create: {
        email,
        fullName: body.fullName?.trim() || null,
        locale: body.locale || 'ES',
        source: 'web_footer',
        consentedAt: new Date(),
        isActive: true,
      },
      update: {
        isActive: true,
        unsubscribedAt: null,
        consentedAt: new Date(),
        locale: body.locale || 'ES',
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
