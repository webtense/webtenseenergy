import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { createAuditLog } from '@/server/services/audit-log';
import { LeadUpdateSchema } from '@/lib/schemas/admin';

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
  const body = await request.json();
  const result = LeadUpdateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: 'Datos inválidos', details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ message: 'Lead no encontrado' }, { status: 404 });
  }

  const { status, note } = result.data;

  const updated = await db.lead.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(status === 'CONTACTED' ? { contactedAt: new Date() } : {}),
      ...(status === 'WON' ? { wonAt: new Date() } : {}),
      ...(status === 'LOST' ? { lostAt: new Date() } : {}),
    },
  });

  const noteBody = note?.trim();
  if (noteBody) {
    await db.leadNote.create({
      data: {
        leadId: id,
        adminUserId: auth.user.id,
        body: noteBody,
      },
    });
  }

  await createAuditLog({
    adminUserId: auth.user.id,
    action: 'lead_updated',
    entityType: 'Lead',
    entityId: id,
    status: 'ok',
    metadata: JSON.stringify({ status: status || lead.status, note: Boolean(noteBody) }),
  });

  return NextResponse.json({ lead: updated });
}
