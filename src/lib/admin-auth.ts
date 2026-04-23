import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE = process.env.ADMIN_SESSION_COOKIE_NAME || 'wt_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminSessionPayload = {
  userId: string;
  role: 'ADMIN' | 'EDITOR';
  username: string;
  exp: number;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET o ADMIN_SECRET no configurado.');
  }
  return secret;
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createAdminSessionToken(
  userId: string,
  username: string,
  role: 'ADMIN' | 'EDITOR'
) {
  const secret = getSecret();
  const body: AdminSessionPayload = {
    userId,
    role,
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const encoded = toBase64Url(JSON.stringify(body));
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export function verifyAdminSessionToken(token: string): AdminSessionPayload | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const secret = getSecret();
    const expectedSignature = sign(encoded, secret);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (actualBuffer.length !== expectedBuffer.length) return null;
    const isValid = timingSafeEqual(actualBuffer, expectedBuffer);
    if (!isValid) return null;

    const parsed = JSON.parse(fromBase64Url(encoded)) as AdminSessionPayload;
    if (!parsed.userId || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
