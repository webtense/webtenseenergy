import { NextResponse } from 'next/server';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin, isValidEmail, normalizeEmail } from '@/lib/security';
import { sendCampaignTest } from '@/server/services/admin-newsletter';

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Props) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser('ADMIN');
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const body = (await request.json()) as { email?: string };
  const email = normalizeEmail(body.email || '');

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: 'Email de prueba no valido' }, { status: 400 });
  }

  try {
    await sendCampaignTest({ campaignId: id, testEmail: email, adminUserId: auth.user.id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error interno' },
      { status: 400 }
    );
  }
}
