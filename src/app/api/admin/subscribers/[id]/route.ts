import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { createAuditLog } from '@/server/services/audit-log';

interface Props {
  params: Promise<{ id: string }>;
}

type UpdateSubscriberBody = {
  fullName?: string;
  locale?: 'ES' | 'CA';
  source?: string;
  isActive?: boolean;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser('ADMIN');
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const body = (await request.json()) as UpdateSubscriberBody;

  const subscriber = await db.subscriber.findUnique({ where: { id } });
  if (!subscriber) {
    return NextResponse.json({ message: 'Suscriptor no encontrado' }, { status: 404 });
  }

  const updated = await db.subscriber.update({
    where: { id },
    data: {
      ...(typeof body.fullName === 'string' ? { fullName: body.fullName.trim() || null } : {}),
      ...(body.locale ? { locale: body.locale } : {}),
      ...(typeof body.source === 'string'
        ? { source: body.source.trim() || subscriber.source }
        : {}),
      ...(typeof body.isActive === 'boolean'
        ? {
            isActive: body.isActive,
            unsubscribedAt: body.isActive ? null : new Date(),
          }
        : {}),
    },
  });

  await createAuditLog({
    adminUserId: auth.user.id,
    action: 'subscriber_updated',
    entityType: 'Subscriber',
    entityId: id,
    status: 'ok',
    metadata: JSON.stringify({ isActive: updated.isActive, locale: updated.locale }),
  });

  return NextResponse.json({ subscriber: updated });
}
