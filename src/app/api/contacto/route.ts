import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  hashIdentifier,
  isValidEmail,
  normalizeEmail,
} from '@/lib/security';
import { submitContactRequest } from '@/server/services/contact-service';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

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

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const safeEmail = normalizeEmail(email);
    if (!isValidEmail(safeEmail)) {
      return NextResponse.json({ error: 'Email no valido' }, { status: 400 });
    }

    await submitContactRequest(request, {
      name: escapeHtml(String(name)),
      email: safeEmail,
      phone: String(phone || ''),
      subject: String(subject || ''),
      message: escapeHtml(String(message)),
    });

    return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    logger.error({ err: error }, 'Error procesando el formulario');
    return NextResponse.json({ error: 'Hubo un error al enviar el correo' }, { status: 500 });
  }
}
