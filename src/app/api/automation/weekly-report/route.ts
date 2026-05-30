import { db } from '@/lib/db';

export async function GET(request: Request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [leads, studies, subscribers, publishedPosts, draftCount] = await Promise.all([
    db.lead.findMany({
      where: { createdAt: { gte: weekAgo } },
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        email: true,
        subject: true,
        status: true,
        source: true,
        createdAt: true,
      },
    }),
    db.studyRequest.findMany({
      where: { createdAt: { gte: weekAgo } },
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        email: true,
        company: true,
        status: true,
        method: true,
        createdAt: true,
      },
    }),
    db.subscriber.count({ where: { createdAt: { gte: weekAgo } } }),
    db.post.findMany({
      where: { publishedAt: { gte: weekAgo } },
      include: { translations: { where: { locale: 'ES' } } },
      orderBy: { publishedAt: 'desc' },
    }),
    db.post.count({ where: { status: 'DRAFT' } }),
  ]);

  return Response.json({
    period: {
      from: weekAgo.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    },
    leads: {
      count: leads.length,
      items: leads.map((l) => ({
        name: l.name,
        email: l.email,
        subject: l.subject ?? '-',
        status: l.status,
        source: l.source,
        date: l.createdAt.toISOString().split('T')[0],
      })),
    },
    studies: {
      count: studies.length,
      items: studies.map((s) => ({
        name: s.name,
        email: s.email,
        company: s.company ?? '-',
        status: s.status,
        method: s.method,
        date: s.createdAt.toISOString().split('T')[0],
      })),
    },
    subscribers: { count: subscribers },
    blog: {
      published: publishedPosts.length,
      publishedTitles: publishedPosts.map((p) => p.translations[0]?.title ?? p.slug),
      drafts: draftCount,
      adminUrl: 'https://webtenseenergy.com/admin/content',
    },
  });
}
