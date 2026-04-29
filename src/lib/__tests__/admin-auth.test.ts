import { describe, it, expect, beforeEach } from 'vitest';
import { createAdminSessionToken, verifyAdminSessionToken } from '../admin-auth';

const SECRET = 'test-secret-for-unit-tests-only';

beforeEach(() => {
  process.env.ADMIN_SESSION_SECRET = SECRET;
});

describe('createAdminSessionToken', () => {
  it('genera un token con dos segmentos separados por punto', () => {
    const token = createAdminSessionToken('user-1', 'admin', 'ADMIN');
    expect(token.split('.')).toHaveLength(2);
  });

  it('el payload contiene userId, role, username, isActive y exp', () => {
    const token = createAdminSessionToken('user-1', 'admin', 'ADMIN');
    const [encoded] = token.split('.');
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    expect(payload.userId).toBe('user-1');
    expect(payload.username).toBe('admin');
    expect(payload.role).toBe('ADMIN');
    expect(payload.isActive).toBe(true);
    expect(typeof payload.exp).toBe('number');
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});

describe('verifyAdminSessionToken', () => {
  it('verifica un token válido y devuelve el payload con isActive', () => {
    const token = createAdminSessionToken('user-42', 'editor', 'EDITOR');
    const result = verifyAdminSessionToken(token);
    expect(result).not.toBeNull();
    expect(result?.userId).toBe('user-42');
    expect(result?.role).toBe('EDITOR');
    expect(result?.isActive).toBe(true);
  });

  it('rechaza un token con firma manipulada', () => {
    const token = createAdminSessionToken('user-1', 'admin', 'ADMIN');
    const [encoded] = token.split('.');
    const tampered = `${encoded}.invalidsignature`;
    expect(verifyAdminSessionToken(tampered)).toBeNull();
  });

  it('rechaza un token con payload manipulado', () => {
    const token = createAdminSessionToken('user-1', 'admin', 'ADMIN');
    const [, sig] = token.split('.');
    const evil = Buffer.from(
      JSON.stringify({ userId: 'hacker', role: 'ADMIN', exp: 9999999999, username: 'hacker' })
    ).toString('base64url');
    expect(verifyAdminSessionToken(`${evil}.${sig}`)).toBeNull();
  });

  it('rechaza tokens mal formados', () => {
    expect(verifyAdminSessionToken('')).toBeNull();
    expect(verifyAdminSessionToken('notavalidtoken')).toBeNull();
    expect(verifyAdminSessionToken('a.b.c')).toBeNull();
  });

  it('rechaza tokens expirados', () => {
    const [encoded] = createAdminSessionToken('u', 'u', 'ADMIN').split('.');
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    payload.exp = Math.floor(Date.now() / 1000) - 100;
    const expiredEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const { createHmac } = require('node:crypto');
    const sig = createHmac('sha256', SECRET).update(expiredEncoded).digest('base64url');
    expect(verifyAdminSessionToken(`${expiredEncoded}.${sig}`)).toBeNull();
  });
});
