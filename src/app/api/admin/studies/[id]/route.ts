import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { createAuditLog } from '@/server/services/audit-log';
import { StudyUpdateSchema } from '@/lib/schemas/admin';

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
  const result = StudyUpdateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: 'Datos inválidos', details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const study = await db.studyRequest.findUnique({ where: { id } });
  if (!study) {
    return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
  }

  const { status } = result.data;

  const updated = await db.studyRequest.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(status === 'REVIEWING' ? { reviewedAt: new Date() } : {}),
      ...(status === 'QUOTED' ? { quotedAt: new Date() } : {}),
      ...(status === 'WON' ? { wonAt: new Date() } : {}),
      ...(status === 'LOST' ? { lostAt: new Date() } : {}),
    },
  });

  await createAuditLog({
    adminUserId: auth.user.id,
    action: 'study_updated',
    entityType: 'StudyRequest',
    entityId: id,
    status: 'ok',
    metadata: JSON.stringify({ status: status || study.status }),
  });

  return NextResponse.json({ study: updated });
}
