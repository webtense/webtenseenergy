import { NextResponse } from 'next/server';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { saveCampaignWithBlocks } from '@/server/services/admin-newsletter';
import { CampaignCreateSchema } from '@/lib/schemas/admin';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser('ADMIN');
  if ('error' in auth) return auth.error;

  const body = await request.json();
  const result = CampaignCreateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: 'Datos inválidos', details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = result.data;

  try {
    const campaign = await saveCampaignWithBlocks({
      name: data.name,
      locale: data.locale,
      subject: data.subject,
      preheader: data.preheader || null,
      status: data.status,
      scheduleType: data.scheduleType || null,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
      authorId: auth.user.id,
      blocks: data.blocks,
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error interno' },
      { status: 400 }
    );
  }
}
