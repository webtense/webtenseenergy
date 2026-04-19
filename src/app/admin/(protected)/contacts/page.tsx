import { db } from "@/lib/db";
import { AdminContactsManager } from "@/components/admin/AdminContactsManager";
import { requireAdminPageUser } from "@/server/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  await requireAdminPageUser("ADMIN");

  const [leads, studies, subscribers, campaigns, emailLogs] = await Promise.all([
    db.lead.findMany({
      include: {
        notes: {
          include: { adminUser: { select: { username: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    }),
    db.studyRequest.findMany({ orderBy: [{ createdAt: "desc" }], take: 200 }),
    db.subscriber.findMany({
      include: {
        consents: { orderBy: { acceptedAt: "desc" }, take: 5 },
        events: { orderBy: { createdAt: "desc" }, take: 10, include: { sendJob: { include: { campaign: true } } } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    }),
    db.campaign.findMany({ orderBy: [{ updatedAt: "desc" }], take: 20 }),
    db.emailLog.findMany({ orderBy: [{ createdAt: "desc" }], take: 40 }),
  ]);

  return (
    <AdminContactsManager
      initialLeads={leads.map((lead) => ({
        ...lead,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
        contactedAt: lead.contactedAt?.toISOString() || null,
        wonAt: lead.wonAt?.toISOString() || null,
        lostAt: lead.lostAt?.toISOString() || null,
        notes: lead.notes.map((note) => ({
          ...note,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
        })),
      }))}
      initialStudies={studies.map((study) => ({
        ...study,
        createdAt: study.createdAt.toISOString(),
        updatedAt: study.updatedAt.toISOString(),
        reviewedAt: study.reviewedAt?.toISOString() || null,
        quotedAt: study.quotedAt?.toISOString() || null,
        wonAt: study.wonAt?.toISOString() || null,
        lostAt: study.lostAt?.toISOString() || null,
      }))}
      initialSubscribers={subscribers.map((subscriber) => ({
        ...subscriber,
        consentedAt: subscriber.consentedAt?.toISOString() || null,
        unsubscribedAt: subscriber.unsubscribedAt?.toISOString() || null,
        createdAt: subscriber.createdAt.toISOString(),
        updatedAt: subscriber.updatedAt.toISOString(),
        consents: subscriber.consents.map((consent) => ({
          ...consent,
          acceptedAt: consent.acceptedAt.toISOString(),
        })),
        events: subscriber.events.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
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
        })),
      }))}
      recentCampaigns={campaigns.map((campaign) => ({
        ...campaign,
        scheduledFor: campaign.scheduledFor?.toISOString() || null,
        sentAt: campaign.sentAt?.toISOString() || null,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
      }))}
      recentEmailLogs={emailLogs.map((log) => ({
        ...log,
        sentAt: log.sentAt?.toISOString() || null,
        createdAt: log.createdAt.toISOString(),
      }))}
    />
  );
}
