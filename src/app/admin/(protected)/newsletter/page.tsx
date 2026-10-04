import nextDynamic from 'next/dynamic';
import { db } from '@/lib/db';
import { requireAdminPageUser } from '@/server/auth/admin';

const AdminNewsletterManager = nextDynamic(() =>
  import('@/components/admin/AdminNewsletterManager').then((m) => m.AdminNewsletterManager)
);

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
      initialCampaigns={campaigns.map((campaign: typeof campaigns[0]) => ({
        ...campaign,
        scheduledFor: campaign.scheduledFor?.toISOString() || null,
        sentAt: campaign.sentAt?.toISOString() || null,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
        blocks: campaign.blocks.map((block: typeof campaign.blocks[0]) => ({
          ...block,
          createdAt: block.createdAt.toISOString(),
          updatedAt: block.updatedAt.toISOString(),
        })),
      }))}
      initialSubscribers={subscribers.map((subscriber: typeof subscribers[0]) => ({
        ...subscriber,
        consentedAt: subscriber.consentedAt?.toISOString() || null,
        unsubscribedAt: subscriber.unsubscribedAt?.toISOString() || null,
        createdAt: subscriber.createdAt.toISOString(),
        updatedAt: subscriber.updatedAt.toISOString(),
      }))}
      initialJobs={jobs.map((job: typeof jobs[0]) => ({
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
      initialEvents={events.map((event: typeof events[0]) => ({
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
