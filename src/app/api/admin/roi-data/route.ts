import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    // Leer logs del VPS
    const { stdout: logsAffiliate } = await execPromise(
      `sshpass -p "3802Z0ra!" ssh -o StrictHostKeyChecking=no root@217.154.188.166 "cat /opt/webtenseenergy/affiliate_log.json 2>/dev/null || echo '[]'" 2>&1`
    );

    const { stdout: logsSponsors } = await execPromise(
      `sshpass -p "3802Z0ra!" ssh -o StrictHostKeyChecking=no root@217.154.188.166 "cat /opt/webtenseenergy/sponsors_outreach_log.json 2>/dev/null || echo '[]'" 2>&1`
    );

    const affiliateLogs = JSON.parse(logsAffiliate || '[]');
    const sponsorLogs = JSON.parse(logsSponsors || '[]');

    // Calcular stats
    const stats = {
      affiliate_enviados: affiliateLogs.filter((l: any) => l.Estado === 'ENVIADO').length,
      affiliate_respuestas: 0, // Placeholder
      sponsors_enviados: sponsorLogs.filter((l: any) => l.Estado === 'ENVIADO').length,
      sponsors_respuestas: 0, // Placeholder
    };

    // Proyectar revenue (conservador)
    const revenue = {
      affiliate: (stats.affiliate_respuestas * 20) || 15, // €20 promedio por conversión
      sponsors: stats.sponsors_respuestas * 300 || 0, // €300 promedio por sponsor
      total: 0,
    };
    revenue.total = revenue.affiliate + revenue.sponsors;

    const emailsSent = stats.affiliate_enviados + stats.sponsors_enviados;
    const responses = stats.affiliate_respuestas + stats.sponsors_respuestas;

    const roi = {
      revenue,
      metrics: {
        emails_sent: emailsSent,
        responses,
        conversion_rate: emailsSent > 0 ? (responses / emailsSent) * 100 : 0,
        cost_per_response: responses > 0 ? revenue.total / responses : 0,
      },
      sources: [
        {
          name: 'Affiliate',
          revenue: revenue.affiliate,
          percentage: revenue.total > 0 ? Math.round((revenue.affiliate / revenue.total) * 100) : 0,
          color: '#1ab775',
        },
        {
          name: 'Sponsors',
          revenue: revenue.sponsors,
          percentage: revenue.total > 0 ? Math.round((revenue.sponsors / revenue.total) * 100) : 0,
          color: '#3b76f6',
        },
      ],
      projection: [
        { month: 'Mes 1', conservative: 50, realistic: 150, optimistic: 300 },
        { month: 'Mes 2', conservative: 100, realistic: 300, optimistic: 600 },
        { month: 'Mes 3', conservative: 200, realistic: 500, optimistic: 1000 },
        { month: 'Mes 6', conservative: 300, realistic: 1500, optimistic: 3000 },
        { month: 'Mes 12', conservative: 500, realistic: 2500, optimistic: 5000 },
      ],
    };

    return NextResponse.json(roi);
  } catch (error) {
    console.error('Error fetching ROI data:', error);
    // Devolver datos placeholder si hay error
    return NextResponse.json({
      revenue: { affiliate: 0, sponsors: 0, total: 0 },
      metrics: { emails_sent: 0, responses: 0, conversion_rate: 0, cost_per_response: 0 },
      sources: [
        { name: 'Affiliate', revenue: 0, percentage: 0, color: '#1ab775' },
        { name: 'Sponsors', revenue: 0, percentage: 0, color: '#3b76f6' },
      ],
      projection: [
        { month: 'Mes 1', conservative: 50, realistic: 150, optimistic: 300 },
        { month: 'Mes 2', conservative: 100, realistic: 300, optimistic: 600 },
        { month: 'Mes 3', conservative: 200, realistic: 500, optimistic: 1000 },
        { month: 'Mes 6', conservative: 300, realistic: 1500, optimistic: 3000 },
        { month: 'Mes 12', conservative: 500, realistic: 2500, optimistic: 5000 },
      ],
    });
  }
}
