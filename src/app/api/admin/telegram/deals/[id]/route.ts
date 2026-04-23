import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';

type UpdateBody = {
  title?: string;
  message?: string;
  url?: string | null;
  status?: string;
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ('error' in auth) return auth.error;

  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateBody;
    const deal = await db.telegramDeal.update({
      where: { id },
      data: {
        ...(body.title ? { title: body.title.trim() } : {}),
        ...(body.message ? { message: body.message.trim() } : {}),
        ...(typeof body.url === 'string' ? { url: body.url.trim() } : {}),
        ...(body.status ? { status: body.status } : {}),
      },
    });

    await db.telegramLog.create({
      data: {
        adminUserId: auth.user.id,
        action: 'draft_updated',
        status: 'ok',
        detail: `deal:${deal.id}`,
      },
    });

    return NextResponse.json({ deal });
  } catch (error) {
    logger.error({ err: error }, 'Error actualizando borrador Telegram');
    return NextResponse.json({ message: 'No se pudo actualizar el borrador.' }, { status: 500 });
  }
}
