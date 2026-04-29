import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  db: {
    auditLog: { create: vi.fn().mockResolvedValue({ id: 'audit-1' }) },
  },
}));

import { db } from '@/lib/db';
import { createAuditLog } from '../audit-log';

describe('createAuditLog', () => {
  beforeEach(() => {
    vi.mocked(db.auditLog.create).mockClear();
  });

  it('crea un log con campos obligatorios', async () => {
    vi.mocked(db.auditLog.create).mockResolvedValueOnce({ id: 'audit-1' } as never);

    await createAuditLog({
      action: 'lead_updated',
      entityType: 'Lead',
      status: 'ok',
    });

    expect(db.auditLog.create).toHaveBeenCalledOnce();
    const { data } = vi.mocked(db.auditLog.create).mock.calls[0][0];
    expect(data.action).toBe('lead_updated');
    expect(data.entityType).toBe('Lead');
    expect(data.status).toBe('ok');
  });

  it('normaliza campos opcionales ausentes a null', async () => {
    vi.mocked(db.auditLog.create).mockResolvedValueOnce({ id: 'audit-2' } as never);

    await createAuditLog({
      action: 'login',
      entityType: 'AdminUser',
      status: 'ok',
    });

    const { data } = vi.mocked(db.auditLog.create).mock.calls[0][0];
    expect(data.adminUserId).toBeNull();
    expect(data.entityId).toBeNull();
    expect(data.ipHash).toBeNull();
    expect(data.userAgent).toBeNull();
    expect(data.metadata).toBeNull();
  });

  it('incluye todos los campos cuando se proporcionan', async () => {
    vi.mocked(db.auditLog.create).mockResolvedValueOnce({ id: 'audit-3' } as never);

    await createAuditLog({
      adminUserId: 'admin-1',
      action: 'post_created',
      entityType: 'Post',
      entityId: 'post-abc',
      status: 'ok',
      ipHash: 'sha256hash',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({ slug: 'test-post' }),
    });

    const { data } = vi.mocked(db.auditLog.create).mock.calls[0][0];
    expect(data.adminUserId).toBe('admin-1');
    expect(data.entityId).toBe('post-abc');
    expect(data.ipHash).toBe('sha256hash');
    expect(data.metadata).toBe('{"slug":"test-post"}');
  });

  it('retorna el objeto creado por Prisma', async () => {
    vi.mocked(db.auditLog.create).mockResolvedValueOnce({ id: 'audit-ok' } as never);

    const result = await createAuditLog({
      action: 'test',
      entityType: 'Test',
      status: 'ok',
    });
    expect(result).toEqual({ id: 'audit-ok' });
  });
});
