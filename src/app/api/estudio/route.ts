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
import { scanFile } from '@/lib/antivirus';
import { submitStudyRequest } from '@/server/services/study-service';

export const runtime = 'nodejs';

const HABIT_LABELS: Record<string, string> = {
  trabajo_casa: 'Trabajo desde casa',
  consumo_noche: 'Consumo principal de noche',
  cocina_electrica: 'Cocina y horno electrico',
  coche_electrico: 'Coche electrico enchufable',
  aerotermia: 'Tengo Aerotermia o Bomba de calor',
  frigorificos_extra: 'Mas de un frigorifico/congelador',
};

function parseHabits(rawHabits: string | null): string[] {
  if (!rawHabits) return [];

  try {
    const parsed = JSON.parse(rawHabits);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    return [];
  }

  return [];
}

export async function POST(request: Request) {
  try {
    const rate = await checkRateLimit({
      key: hashIdentifier(getClientIp(request)),
      endpoint: 'estudio',
      limit: 8,
      windowMs: 10 * 60 * 1000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes, prueba de nuevo en unos minutos.' },
        { status: 429 }
      );
    }

    const form = await request.formData();

    const method = String(form.get('method') || 'manual');
    const kwConsumed = String(form.get('kwConsumed') || '');
    const habits = parseHabits(String(form.get('habits') || '[]'));
    const name = escapeHtml(
      String(form.get('name') || '')
        .trim()
        .slice(0, 120)
    );
    const email = normalizeEmail(String(form.get('email') || '').trim());
    const phone = escapeHtml(
      String(form.get('phone') || '')
        .trim()
        .slice(0, 40)
    );
    const company = escapeHtml(
      String(form.get('company') || '')
        .trim()
        .slice(0, 120)
    );
    const invoiceFile = form.get('invoice');

    if (!name || !email) {
      return NextResponse.json({ error: 'Faltan datos de contacto obligatorios' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email no valido' }, { status: 400 });
    }

    const habitsText =
      habits.length > 0 ? habits.map((h) => HABIT_LABELS[h] || h).join(', ') : 'Ninguno';
    const hasInvoice = invoiceFile instanceof File && invoiceFile.size > 0;
    const safeKwConsumed = escapeHtml(String(kwConsumed || '').slice(0, 20));
    const analysisMethod =
      method === 'upload'
        ? `Subida de factura: ${hasInvoice ? escapeHtml(invoiceFile.name) : 'No se adjunto archivo'}`
        : `Consumo manual: ${safeKwConsumed || 'No especificado'} kWh`;

    let invoiceData: {
      name: string;
      type: string;
      size: number;
      buffer: Buffer;
    } | null = null;

    if (hasInvoice && invoiceFile instanceof File) {
      const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedMimeTypes.includes(invoiceFile.type)) {
        return NextResponse.json(
          { error: 'Formato de factura no permitido. Usa PDF, PNG o JPG.' },
          { status: 400 }
        );
      }

      if (invoiceFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'La factura supera 5MB. Reduce el tamano e intentalo de nuevo.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await invoiceFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      const scanResult = await scanFile(fileBuffer, invoiceFile.name);

      if (!scanResult.safe) {
        return NextResponse.json(
          { error: `Archivo no seguro: ${scanResult.threat}` },
          { status: 400 }
        );
      }

      invoiceData = {
        name: invoiceFile.name,
        type: invoiceFile.type,
        size: invoiceFile.size,
        buffer: fileBuffer,
      };
    }
    await submitStudyRequest({
      request,
      method,
      kwConsumed: safeKwConsumed,
      habits,
      name,
      email,
      phone,
      company,
      invoiceFile: invoiceData,
      habitsText,
      analysisMethod,
    });

    return NextResponse.json({ success: true, message: 'Solicitud enviada correctamente' });
  } catch (error) {
    logger.error({ err: error }, 'Error procesando estudio energetico');
    return NextResponse.json({ error: 'Hubo un error al procesar la solicitud' }, { status: 500 });
  }
}
