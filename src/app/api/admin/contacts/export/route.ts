import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';

function csvEscape(value: string | number | boolean | null | undefined) {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const auth = await requireAdminApiUser('ADMIN');
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'leads') {
    const leads = await db.lead.findMany({ orderBy: [{ createdAt: 'desc' }] });
    const rows = [
      [
        'id',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'source',
        'status',
        'locale',
        'originPath',
        'createdAt',
      ],
      ...leads.map((lead) => [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.subject,
        lead.message,
        lead.source,
        lead.status,
        lead.locale,
        lead.originPath,
        lead.createdAt.toISOString(),
      ]),
    ];
    return new NextResponse(rows.map((row) => row.map(csvEscape).join(',')).join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="webtense-leads.csv"',
      },
    });
  }

  if (type === 'studies') {
    const studies = await db.studyRequest.findMany({ orderBy: [{ createdAt: 'desc' }] });
    const rows = [
      [
        'id',
        'name',
        'email',
        'phone',
        'company',
        'method',
        'kwConsumed',
        'source',
        'status',
        'locale',
        'originPath',
        'createdAt',
      ],
      ...studies.map((study) => [
        study.id,
        study.name,
        study.email,
        study.phone,
        study.company,
        study.method,
        study.kwConsumed,
        study.source,
        study.status,
        study.locale,
        study.originPath,
        study.createdAt.toISOString(),
      ]),
    ];
    return new NextResponse(rows.map((row) => row.map(csvEscape).join(',')).join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="webtense-studies.csv"',
      },
    });
  }

  if (type === 'subscribers') {
    const subscribers = await db.subscriber.findMany({ orderBy: [{ createdAt: 'desc' }] });
    const rows = [
      [
        'id',
        'email',
        'fullName',
        'locale',
        'isActive',
        'source',
        'consentedAt',
        'unsubscribedAt',
        'createdAt',
      ],
      ...subscribers.map((subscriber) => [
        subscriber.id,
        subscriber.email,
        subscriber.fullName,
        subscriber.locale,
        subscriber.isActive,
        subscriber.source,
        subscriber.consentedAt?.toISOString() || '',
        subscriber.unsubscribedAt?.toISOString() || '',
        subscriber.createdAt.toISOString(),
      ]),
    ];
    return new NextResponse(rows.map((row) => row.map(csvEscape).join(',')).join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="webtense-subscribers.csv"',
      },
    });
  }

  return NextResponse.json({ message: 'Tipo de exportacion no soportado' }, { status: 400 });
}
