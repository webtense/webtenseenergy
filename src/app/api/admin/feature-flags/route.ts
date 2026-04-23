import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { ensureAdminDefaults } from '@/lib/admin-defaults';
import { isSameOrigin } from '@/lib/security';

type FlagBody = {
  key?: string;
  enabled?: boolean;
  description?: string;
};

export async function GET() {
  const result = await requireAdminApiUser('ADMIN');
  if ('error' in result) return result.error;

  await ensureAdminDefaults();

  const flags = await db.featureFlag.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json({ flags });
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const result = await requireAdminApiUser('ADMIN');
  if ('error' in result) return result.error;

  try {
    const body = (await request.json()) as FlagBody;
    if (!body.key || typeof body.enabled !== 'boolean') {
      return NextResponse.json({ message: 'Datos invalidos' }, { status: 400 });
    }

    const flag = await db.featureFlag.upsert({
      where: { key: body.key },
      create: {
        key: body.key,
        enabled: body.enabled,
        description: body.description || null,
      },
      update: {
        enabled: body.enabled,
        ...(body.description ? { description: body.description } : {}),
      },
    });

    return NextResponse.json({ flag });
  } catch (error) {
    logger.error({ err: error }, 'Error actualizando flag');
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}
