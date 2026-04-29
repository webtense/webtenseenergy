import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  hashIdentifier,
  normalizeEmail,
} from '@/lib/security';
import { ContactoSchema } from '@/lib/schemas/public';
import { submitContactRequest } from '@/server/services/contact-service';

export async function POST(request: Request) {
  try {
    const rate = await checkRateLimit({
      key: hashIdentifier(getClientIp(request)),
      endpoint: 'contacto',
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes, prueba en unos minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: campo oculto que solo rellenan bots
    if (body.website) {
      return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
    }

    // Timing: menos de 1.2s desde carga de página = bot
    const elapsed = Date.now() - parseInt(body._t ?? '0', 10);
    if (!body._t || elapsed < 1200) {
      return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
    }

    // Nombre aleatorio: >17 chars sin ningún espacio
    const rawName = typeof body.name === 'string' ? body.name : '';
    if (rawName.length > 17 && !/\s/.test(rawName)) {
      return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
    }

    const result = ContactoSchema.safeParse({
      ...body,
      email: typeof body.email === 'string' ? normalizeEmail(body.email) : body.email,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    await submitContactRequest(request, {
      name: escapeHtml(name),
      email,
      phone: escapeHtml(phone),
      subject: escapeHtml(subject),
      message: escapeHtml(message),
    });

    return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    logger.error({ err: error }, 'Error procesando el formulario');
    return NextResponse.json({ error: 'Hubo un error al enviar el correo' }, { status: 500 });
  }
}
