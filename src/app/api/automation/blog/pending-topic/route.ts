import { db } from '@/lib/db';

const KEY = 'pending_blog_topics';

export async function POST(request: Request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  // Acepta { topics: [...] } o { topic: "..." } para compatibilidad
  const topics: string[] = body.topics ?? (body.topic ? [body.topic] : null);
  if (!topics?.length) return Response.json({ error: 'topics required' }, { status: 400 });

  await db.siteSetting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(topics) },
    create: { key: KEY, value: JSON.stringify(topics) },
  });
  return Response.json({ ok: true, topics });
}

export async function GET(request: Request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const row = await db.siteSetting.findUnique({ where: { key: KEY } });
  if (!row) return Response.json({ topics: null, topic: null });
  try {
    const topics = JSON.parse(row.value) as string[];
    return Response.json({ topics, topic: topics[0] });
  } catch {
    return Response.json({ topics: [row.value], topic: row.value });
  }
}
