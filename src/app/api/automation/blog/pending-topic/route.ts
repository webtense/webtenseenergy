import { db } from '@/lib/db';

const KEY = 'pending_blog_topic';

export async function POST(request: Request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { topic } = await request.json();
  if (!topic) return Response.json({ error: 'topic required' }, { status: 400 });

  await db.siteSetting.upsert({
    where: { key: KEY },
    update: { value: topic },
    create: { key: KEY, value: topic },
  });
  return Response.json({ ok: true, topic });
}

export async function GET(request: Request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const row = await db.siteSetting.findUnique({ where: { key: KEY } });
  return Response.json({ topic: row?.value ?? null });
}
