import { NextResponse } from 'next/server';
import { requireAdminApiUser } from '@/lib/admin-guard';

export async function GET() {
  const result = await requireAdminApiUser();
  if ('error' in result) return result.error;

  return NextResponse.json({
    user: {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
    },
  });
}
