import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  db: { adminUser: { findUnique: vi.fn() } },
}));

vi.mock('@/lib/admin-auth', () => ({
  getAdminSession: vi.fn(),
}));

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => { throw new Error('REDIRECT'); }),
}));

import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-auth';
import { hasRequiredRole, requireAdminApiUser } from '../auth/admin';

describe('hasRequiredRole', () => {
  it('ADMIN tiene rol ADMIN', () => {
    expect(hasRequiredRole('ADMIN', 'ADMIN')).toBe(true);
  });

  it('ADMIN también tiene rol EDITOR', () => {
    expect(hasRequiredRole('ADMIN', 'EDITOR')).toBe(true);
  });

  it('EDITOR tiene rol EDITOR', () => {
    expect(hasRequiredRole('EDITOR', 'EDITOR')).toBe(true);
  });

  it('EDITOR NO tiene rol ADMIN', () => {
    expect(hasRequiredRole('EDITOR', 'ADMIN')).toBe(false);
  });
});

describe('requireAdminApiUser', () => {
  const activeAdmin = {
    id: 'user-1',
    username: 'admin',
    email: 'admin@test.com',
    role: 'ADMIN' as const,
    isActive: true,
  };

  beforeEach(() => {
    vi.mocked(getAdminSession).mockReset();
    vi.mocked(db.adminUser.findUnique).mockReset();
  });

  it('retorna usuario cuando sesión es válida y usuario activo', async () => {
    vi.mocked(getAdminSession).mockResolvedValueOnce({
      userId: 'user-1', username: 'admin', role: 'ADMIN', isActive: true, exp: 9999999999,
    });
    vi.mocked(db.adminUser.findUnique).mockResolvedValueOnce(activeAdmin as never);

    const result = await requireAdminApiUser('ADMIN');
    expect('user' in result).toBe(true);
    if ('user' in result && result.user) {
      expect(result.user.id).toBe('user-1');
    }
  });

  it('retorna error 401 si no hay sesión', async () => {
    vi.mocked(getAdminSession).mockResolvedValueOnce(null);

    const result = await requireAdminApiUser();
    expect('error' in result).toBe(true);
    if ('error' in result && result.error) {
      expect(result.error.status).toBe(401);
    }
  });

  it('retorna error 403 si rol insuficiente', async () => {
    const editorUser = { ...activeAdmin, role: 'EDITOR' as const };
    vi.mocked(getAdminSession).mockResolvedValueOnce({
      userId: 'editor-1', username: 'editor', role: 'EDITOR', isActive: true, exp: 9999999999,
    });
    vi.mocked(db.adminUser.findUnique).mockResolvedValueOnce(editorUser as never);

    const result = await requireAdminApiUser('ADMIN');
    expect('error' in result).toBe(true);
    if ('error' in result && result.error) {
      expect(result.error.status).toBe(403);
    }
  });

  it('retorna error 401 si usuario está inactivo', async () => {
    vi.mocked(getAdminSession).mockResolvedValueOnce({
      userId: 'user-1', username: 'admin', role: 'ADMIN', isActive: true, exp: 9999999999,
    });
    vi.mocked(db.adminUser.findUnique).mockResolvedValueOnce({
      ...activeAdmin, isActive: false,
    } as never);

    const result = await requireAdminApiUser();
    expect('error' in result).toBe(true);
    if ('error' in result && result.error) {
      expect(result.error.status).toBe(401);
    }
  });
});
