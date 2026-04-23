import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';

export async function GET() {
  const auth = await requireAdminApiUser();
  if ('error' in auth) return auth.error;

  const leads = await db.lead.findMany({
    include: {
      notes: {
        include: {
          adminUser: {
            select: { username: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: [{ createdAt: 'desc' }],
    take: 100,
  });

  return NextResponse.json({ leads });
}
