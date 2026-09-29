import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    // Leer archivo de respuestas del VPS
    const { stdout } = await execPromise(
      `sshpass -p "3802Z0ra!" ssh -o StrictHostKeyChecking=no root@217.154.188.166 "cat /opt/webtenseenergy/gmail_responses_detected.json 2>/dev/null || echo '[]'" 2>&1`
    );

    const responses = JSON.parse(stdout || '[]');

    // Calcular estadísticas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const nuevas = responses.filter((r: any) => {
      const fecha = new Date(r.timestamp);
      fecha.setHours(0, 0, 0, 0);
      return fecha.getTime() === hoy.getTime();
    }).length;

    const por_tipo: Record<string, number> = {};
    responses.forEach((r: any) => {
      por_tipo[r.tipo] = (por_tipo[r.tipo] || 0) + 1;
    });

    return NextResponse.json({
      responses: responses.slice(0, 50), // Últimas 50
      stats: {
        total: responses.length,
        nuevas,
        por_tipo,
      },
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({
      responses: [],
      stats: { total: 0, nuevas: 0, por_tipo: {} },
    });
  }
}
