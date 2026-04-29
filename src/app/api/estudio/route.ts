import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  hashIdentifier,
  normalizeEmail,
} from '@/lib/security';
import { scanFile } from '@/lib/antivirus';
import { EstudioTextSchema } from '@/lib/schemas/public';
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

    // Honeypot: campo oculto que solo rellenan bots
    if (form.get('website')) {
      return NextResponse.json({ success: true, message: 'Solicitud enviada correctamente' });
    }

    // Timing: menos de 1.2s desde carga de página = bot
    const elapsed = Date.now() - parseInt(String(form.get('_t') ?? '0'), 10);
    if (!form.get('_t') || elapsed < 1200) {
      return NextResponse.json({ success: true, message: 'Solicitud enviada correctamente' });
    }

    // Nombre aleatorio: >17 chars sin ningún espacio
    const rawName = String(form.get('name') ?? '');
    if (rawName.length > 17 && !/\s/.test(rawName)) {
      return NextResponse.json({ success: true, message: 'Solicitud enviada correctamente' });
    }

    const result = EstudioTextSchema.safeParse({
      method: form.get('method') ?? undefined,
      name: form.get('name'),
      email: normalizeEmail(String(form.get('email') ?? '')),
      phone: form.get('phone') ?? undefined,
      company: form.get('company') ?? undefined,
      kwConsumed: form.get('kwConsumed') ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { method, name, email, phone, company, kwConsumed } = result.data;
    const habits = parseHabits(String(form.get('habits') || '[]'));
    const invoiceFile = form.get('invoice');

    const habitsText =
      habits.length > 0 ? habits.map((h) => HABIT_LABELS[h] || h).join(', ') : 'Ninguno';
    const hasInvoice = invoiceFile instanceof File && invoiceFile.size > 0;
    const safeKwConsumed = escapeHtml(kwConsumed.slice(0, 20));
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
      name: escapeHtml(name),
      email,
      phone: escapeHtml(phone),
      company: escapeHtml(company),
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
