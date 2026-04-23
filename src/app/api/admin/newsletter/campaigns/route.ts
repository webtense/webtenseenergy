import { NextResponse } from 'next/server';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { saveCampaignWithBlocks } from '@/server/services/admin-newsletter';

type CampaignBody = {
  name?: string;
  locale?: 'ES' | 'CA';
  subject?: string;
  preheader?: string | null;
  status?: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  scheduleType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONCE' | null;
  scheduledFor?: string | null;
  blocks?: Array<{ id?: string; sortOrder: number; type: string; content: string }>;
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser('ADMIN');
  if ('error' in auth) return auth.error;

  const body = (await request.json()) as CampaignBody;
  if (!body.name?.trim() || !body.subject?.trim()) {
    return NextResponse.json({ message: 'Nombre y asunto son obligatorios' }, { status: 400 });
  }

  try {
    const campaign = await saveCampaignWithBlocks({
      name: body.name.trim(),
      locale: body.locale || 'ES',
      subject: body.subject.trim(),
      preheader: body.preheader || null,
      status: body.status || 'DRAFT',
      scheduleType: body.scheduleType || null,
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
      authorId: auth.user.id,
      blocks: body.blocks || [],
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error interno' },
      { status: 400 }
    );
  }
}
