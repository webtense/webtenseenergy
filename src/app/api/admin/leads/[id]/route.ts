import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { createAuditLog } from '@/server/services/audit-log';

type UpdateLeadBody = {
  status?: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'WON' | 'LOST' | 'SPAM';
  note?: string;
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

  const { id } = await params;
  const body = (await request.json()) as UpdateLeadBody;

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ message: 'Lead no encontrado' }, { status: 404 });
  }

  const updated = await db.lead.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.status === 'CONTACTED' ? { contactedAt: new Date() } : {}),
      ...(body.status === 'WON' ? { wonAt: new Date() } : {}),
      ...(body.status === 'LOST' ? { lostAt: new Date() } : {}),
    },
  });

  const noteBody = body.note?.trim();
  if (noteBody) {
    await db.leadNote.create({
      data: {
        leadId: id,
        adminUserId: auth.user.id,
        body: noteBody.slice(0, 4000),
      },
    });
  }

  await createAuditLog({
    adminUserId: auth.user.id,
    action: 'lead_updated',
    entityType: 'Lead',
    entityId: id,
    status: 'ok',
    metadata: JSON.stringify({ status: body.status || lead.status, note: Boolean(noteBody) }),
  });

  return NextResponse.json({ lead: updated });
}
