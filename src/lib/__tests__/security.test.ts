import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({ db: { rateLimit: { upsert: vi.fn(), update: vi.fn() } } }));

import { db } from '@/lib/db';
import {
  escapeHtml,
  normalizeEmail,
  isValidEmail,
  hashIdentifier,
  isSameOrigin,
  getClientIp,
  checkRateLimit,
} from '../security';

describe('escapeHtml', () => {
  it('escapa caracteres especiales HTML', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('escapa ampersand', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
  });

  it('escapa comillas simples', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('devuelve string vacío sin modificar', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('no modifica texto sin caracteres especiales', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });
});

describe('normalizeEmail', () => {
  it('convierte a minúsculas', () => {
    expect(normalizeEmail('Test@EXAMPLE.COM')).toBe('test@example.com');
  });

  it('elimina espacios', () => {
    expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
  });
});

describe('isValidEmail', () => {
  it('acepta emails válidos', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user+tag@sub.domain.com')).toBe(true);
  });

  it('rechaza emails sin @', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });

  it('rechaza emails sin dominio', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rechaza string vacío', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rechaza emails de más de 254 caracteres', () => {
    expect(isValidEmail('a'.repeat(250) + '@example.com')).toBe(false);
  });
});

describe('hashIdentifier', () => {
  it('produce hash sha256 hexadecimal', () => {
    const hash = hashIdentifier('test-value');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('produce el mismo hash para el mismo input', () => {
    expect(hashIdentifier('same')).toBe(hashIdentifier('same'));
  });

  it('produce hashes diferentes para inputs diferentes', () => {
    expect(hashIdentifier('a')).not.toBe(hashIdentifier('b'));
  });
});

describe('getClientIp', () => {
  it('lee x-forwarded-for', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('lee x-real-ip como fallback', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '9.10.11.12' },
    });
    expect(getClientIp(req)).toBe('9.10.11.12');
  });

  it('devuelve unknown si no hay headers de IP', () => {
    const req = new Request('http://localhost');
    expect(getClientIp(req)).toBe('unknown');
  });
});

describe('isSameOrigin', () => {
  it('permite peticiones del mismo origen', () => {
    const req = new Request('http://example.com/api', {
      headers: { origin: 'http://example.com', host: 'example.com' },
    });
    expect(isSameOrigin(req)).toBe(true);
  });

  it('rechaza peticiones de otro origen', () => {
    const req = new Request('http://example.com/api', {
      headers: { origin: 'http://evil.com', host: 'example.com' },
    });
    expect(isSameOrigin(req)).toBe(false);
  });

  it('usa referer si no hay origin', () => {
    const req = new Request('http://example.com/api', {
      headers: { referer: 'http://example.com/page', host: 'example.com' },
    });
    expect(isSameOrigin(req)).toBe(true);
  });

  it('rechaza si no hay origin ni referer', () => {
    const req = new Request('http://example.com/api', {
      headers: { host: 'example.com' },
    });
    expect(isSameOrigin(req)).toBe(false);
  });
});

describe('checkRateLimit', () => {
  const params = { key: 'ip-hash', endpoint: 'test', limit: 10, windowMs: 60000 };
  const futureReset = new Date(Date.now() + 60000);
  const pastReset = new Date(Date.now() - 1000);

  beforeEach(() => {
    vi.mocked(db.rateLimit.upsert).mockReset();
    vi.mocked(db.rateLimit.update).mockReset();
  });

  const now = new Date();

  it('permite requests dentro del límite', async () => {
    vi.mocked(db.rateLimit.upsert).mockResolvedValueOnce({
      id: '1', identifier: 'ip-hash', endpoint: 'test', count: 5, resetAt: futureReset, createdAt: now, updatedAt: now,
    });
    const result = await checkRateLimit(params);
    expect(result.allowed).toBe(true);
  });

  it('bloquea cuando el contador supera el límite', async () => {
    vi.mocked(db.rateLimit.upsert).mockResolvedValueOnce({
      id: '1', identifier: 'ip-hash', endpoint: 'test', count: 11, resetAt: futureReset, createdAt: now, updatedAt: now,
    });
    const result = await checkRateLimit(params);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('reinicia el contador si el registro ya expiró', async () => {
    vi.mocked(db.rateLimit.upsert).mockResolvedValueOnce({
      id: '1', identifier: 'ip-hash', endpoint: 'test', count: 99, resetAt: pastReset, createdAt: now, updatedAt: now,
    });
    vi.mocked(db.rateLimit.update).mockResolvedValueOnce({} as never);
    const result = await checkRateLimit(params);
    expect(result.allowed).toBe(true);
    expect(db.rateLimit.update).toHaveBeenCalledOnce();
  });

  it('permite el request si la BD falla (fail-open)', async () => {
    vi.mocked(db.rateLimit.upsert).mockRejectedValueOnce(new Error('DB error'));
    const result = await checkRateLimit(params);
    expect(result.allowed).toBe(true);
  });
});
