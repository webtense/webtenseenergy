import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { hasValidCronBearer } from '../machine-auth';

describe('hasValidCronBearer', () => {
  const originalEnv = process.env.CRON_SECRET;

  beforeEach(() => {
    process.env.CRON_SECRET = 'super-secret-cron-token';
  });

  afterEach(() => {
    process.env.CRON_SECRET = originalEnv;
  });

  it('acepta bearer token correcto', () => {
    const req = new Request('http://localhost/api/automation/daily', {
      headers: { authorization: 'Bearer super-secret-cron-token' },
    });
    expect(hasValidCronBearer(req)).toBe(true);
  });

  it('rechaza bearer token incorrecto', () => {
    const req = new Request('http://localhost/api/automation/daily', {
      headers: { authorization: 'Bearer wrong-token' },
    });
    expect(hasValidCronBearer(req)).toBe(false);
  });

  it('rechaza sin header de autorización', () => {
    const req = new Request('http://localhost/api/automation/daily');
    expect(hasValidCronBearer(req)).toBe(false);
  });

  it('rechaza si CRON_SECRET no está configurado', () => {
    delete process.env.CRON_SECRET;
    const req = new Request('http://localhost/api/automation/daily', {
      headers: { authorization: 'Bearer cualquier-cosa' },
    });
    expect(hasValidCronBearer(req)).toBe(false);
  });

  it('es sensible a mayúsculas/minúsculas', () => {
    const req = new Request('http://localhost/api/automation/daily', {
      headers: { authorization: 'Bearer SUPER-SECRET-CRON-TOKEN' },
    });
    expect(hasValidCronBearer(req)).toBe(false);
  });
});
