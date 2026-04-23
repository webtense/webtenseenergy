import { db } from '@/lib/db';
import { AdminNewsletterManager } from '@/components/admin/AdminNewsletterManager';
import { requireAdminPageUser } from '@/server/auth/admin';

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  await requireAdminPageUser('ADMIN');

  const [campaigns, subscribers, jobs, events, logs] = await Promise.all([
    db.campaign.findMany({
      include: { blocks: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ updatedAt: 'desc' }],
    }),
    db.subscriber.findMany({ orderBy: [{ createdAt: 'desc' }], take: 50 }),
    db.sendJob.findMany({
      include: { campaign: true },
      orderBy: [{ createdAt: 'desc' }],
      take: 100,
    }),
    db.sendEvent.findMany({
      include: { subscriber: true, sendJob: { include: { campaign: true } } },
      orderBy: [{ createdAt: 'desc' }],
      take: 100,
    }),
    db.emailLog.findMany({
      where: { entityType: 'Campaign' },
      orderBy: [{ createdAt: 'desc' }],
      take: 100,
    }),
  ]);

  return (
    <AdminNewsletterManager
      initialCampaigns={campaigns.map((campaign) => ({
        ...campaign,
        scheduledFor: campaign.scheduledFor?.toISOString() || null,
        sentAt: campaign.sentAt?.toISOString() || null,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
        blocks: campaign.blocks.map((block) => ({
          ...block,
          createdAt: block.createdAt.toISOString(),
          updatedAt: block.updatedAt.toISOString(),
        })),
      }))}
      initialSubscribers={subscribers.map((subscriber) => ({
        ...subscriber,
        consentedAt: subscriber.consentedAt?.toISOString() || null,
        unsubscribedAt: subscriber.unsubscribedAt?.toISOString() || null,
        createdAt: subscriber.createdAt.toISOString(),
        updatedAt: subscriber.updatedAt.toISOString(),
      }))}
      initialJobs={jobs.map((job) => ({
        ...job,
        runAt: job.runAt.toISOString(),
        finishedAt: job.finishedAt?.toISOString() || null,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        campaign: {
          ...job.campaign,
          scheduledFor: job.campaign.scheduledFor?.toISOString() || null,
          sentAt: job.campaign.sentAt?.toISOString() || null,
          createdAt: job.campaign.createdAt.toISOString(),
          updatedAt: job.campaign.updatedAt.toISOString(),
        },
      }))}
      initialEvents={events.map((event) => ({
        ...event,
        createdAt: event.createdAt.toISOString(),
        subscriber: {
          ...event.subscriber,
          consentedAt: event.subscriber.consentedAt?.toISOString() || null,
          unsubscribedAt: event.subscriber.unsubscribedAt?.toISOString() || null,
          createdAt: event.subscriber.createdAt.toISOString(),
          updatedAt: event.subscriber.updatedAt.toISOString(),
        },
        sendJob: {
          ...event.sendJob,
          runAt: event.sendJob.runAt.toISOString(),
          finishedAt: event.sendJob.finishedAt?.toISOString() || null,
          createdAt: event.sendJob.createdAt.toISOString(),
          updatedAt: event.sendJob.updatedAt.toISOString(),
          campaign: {
            ...event.sendJob.campaign,
            scheduledFor: event.sendJob.campaign.scheduledFor?.toISOString() || null,
            sentAt: event.sendJob.campaign.sentAt?.toISOString() || null,
            createdAt: event.sendJob.campaign.createdAt.toISOString(),
            updatedAt: event.sendJob.campaign.updatedAt.toISOString(),
          },
        },
      }))}
      initialLogs={logs.map((log) => ({
        ...log,
        sentAt: log.sentAt?.toISOString() || null,
        createdAt: log.createdAt.toISOString(),
      }))}
    />
  );
}
