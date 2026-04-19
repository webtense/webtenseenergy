import { db } from "@/lib/db";

export async function getAdminSummaryData() {
  const [
    leadCount,
    studyCount,
    subscriberCount,
    pendingDeals,
    recentLeads,
    recentStudies,
    recentSubscribers,
    recentCampaigns,
    recentDeals,
    recentAuditLogs,
  ] = await Promise.all([
    db.lead.count(),
    db.studyRequest.count(),
    db.subscriber.count({ where: { isActive: true } }),
    db.telegramDeal.count({ where: { status: { not: "sent" } } }),
    db.lead.findMany({ orderBy: [{ createdAt: "desc" }], take: 5 }),
    db.studyRequest.findMany({ orderBy: [{ createdAt: "desc" }], take: 5 }),
    db.subscriber.findMany({ orderBy: [{ createdAt: "desc" }], take: 5 }),
    db.campaign.findMany({ orderBy: [{ updatedAt: "desc" }], take: 5 }),
    db.telegramDeal.findMany({ orderBy: [{ updatedAt: "desc" }], take: 5 }),
    db.auditLog.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 6,
      include: {
        adminUser: {
          select: { username: true },
        },
      },
    }),
  ]);

  return {
    kpis: {
      leadCount,
      studyCount,
      subscriberCount,
      pendingDeals,
    },
    recentLeads,
    recentStudies,
    recentSubscribers,
    recentCampaigns,
    recentDeals,
    recentAuditLogs,
  };
}
