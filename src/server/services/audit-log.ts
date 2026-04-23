import { db } from '@/lib/db';

type AuditInput = {
  adminUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  status: string;
  ipHash?: string | null;
  userAgent?: string | null;
  metadata?: string | null;
};

export async function createAuditLog(input: AuditInput) {
  return db.auditLog.create({
    data: {
      adminUserId: input.adminUserId || null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId || null,
      status: input.status,
      ipHash: input.ipHash || null,
      userAgent: input.userAgent || null,
      metadata: input.metadata || null,
    },
  });
}
