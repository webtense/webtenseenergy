import { db } from '@/lib/db';
import { AdminSystemManager } from '@/components/admin/AdminSystemManager';
import { requireAdminPageUser } from '@/server/auth/admin';

export const dynamic = 'force-dynamic';

export default async function AdminSystemPage() {
  await requireAdminPageUser('ADMIN');

  const [users, auditLogs, telegramConfig, recentEmailErrors] = await Promise.all([
    db.adminUser.findMany({ orderBy: [{ createdAt: 'asc' }] }),
    db.auditLog.findMany({
      include: { adminUser: { select: { username: true, email: true } } },
      orderBy: [{ createdAt: 'desc' }],
      take: 100,
    }),
    db.telegramConfig.findFirst({ orderBy: [{ updatedAt: 'desc' }] }),
    db.emailLog.findMany({
      where: { status: 'failed' },
      orderBy: [{ createdAt: 'desc' }],
      take: 20,
    }),
  ]);

  return (
    <AdminSystemManager
      users={users.map((user: typeof users[0]) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }))}
      auditLogs={auditLogs.map((log: typeof logs[0]) => ({
        ...log,
        createdAt: log.createdAt.toISOString(),
      }))}
      telegramConfig={
        telegramConfig
          ? {
              ...telegramConfig,
              createdAt: telegramConfig.createdAt.toISOString(),
              updatedAt: telegramConfig.updatedAt.toISOString(),
            }
          : null
      }
      recentEmailErrors={recentEmailErrors.map((log: typeof logs[0]) => ({
        ...log,
        sentAt: log.sentAt?.toISOString() || null,
        createdAt: log.createdAt.toISOString(),
      }))}
    />
  );
}
