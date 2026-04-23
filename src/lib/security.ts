import { createHash } from 'node:crypto';
import { db } from '@/lib/db';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  if (!value || value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function checkRateLimit(params: {
  key: string;
  endpoint: string;
  limit: number;
  windowMs: number;
}): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + params.windowMs);

  try {
    const record = await db.rateLimit.upsert({
      where: { identifier_endpoint: { identifier: params.key, endpoint: params.endpoint } },
      create: { identifier: params.key, endpoint: params.endpoint, count: 1, resetAt },
      update: {
        count: { increment: 1 },
        resetAt: { set: new Date(Math.max(Date.now() + params.windowMs, 0)) },
      },
    });

    // Si el registro existente ya expiró, lo reiniciamos vía raw
    if (record.resetAt < now) {
      await db.rateLimit.update({
        where: { identifier_endpoint: { identifier: params.key, endpoint: params.endpoint } },
        data: { count: 1, resetAt },
      });
      return { allowed: true, retryAfter: 0 };
    }

    if (record.count > params.limit) {
      const retryAfter = Math.ceil((record.resetAt.getTime() - now.getTime()) / 1000);
      return { allowed: false, retryAfter };
    }

    return { allowed: true, retryAfter: 0 };
  } catch {
    // Si falla la BD, permitir el request para no bloquear el servicio
    return { allowed: true, retryAfter: 0 };
  }
}

export function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!host) return false;

  try {
    if (origin) {
      const originUrl = new URL(origin);
      return originUrl.host === host;
    }

    const referer = request.headers.get('referer');
    if (!referer) return false;
    const refererUrl = new URL(referer);
    return refererUrl.host === host;
  } catch {
    return false;
  }
}
