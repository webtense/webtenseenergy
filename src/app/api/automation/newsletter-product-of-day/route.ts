import { NextRequest, NextResponse } from 'next/server';
import { sendProductOfDayNewsletter } from '@/server/jobs/newsletter-product-of-day';

const CRON_SECRET = process.env.CRON_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // Validar secreto de CRON
    const authHeader = req.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    if (!CRON_SECRET || providedSecret !== CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ejecutar job
    const result = await sendProductOfDayNewsletter();

    return NextResponse.json(
      {
        success: true,
        message: 'Product of Day newsletter sent',
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/automation/newsletter-product-of-day]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
