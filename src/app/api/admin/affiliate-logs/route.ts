import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    // Leer archivo JSON del VPS via SSH
    const { stdout } = await execPromise(
      `sshpass -p "3802Z0ra!" ssh -o StrictHostKeyChecking=no root@217.154.188.166 "cat /opt/webtenseenergy/affiliate_log.json 2>/dev/null || echo '[]'" 2>&1`
    );

    const logs = JSON.parse(stdout || '[]');

    // Stats
    const stats = {
      total: logs.length,
      enviados: logs.filter((l: any) => l.Estado === 'ENVIADO').length,
      errores: logs.filter((l: any) => l.Estado === 'ERROR').length,
      duplicados: logs.filter((l: any) => l.Estado === 'SKIP').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      logs: logs.reverse(), // Mostrar últimos primero
    });
  } catch (error) {
    console.error('Error leyendo logs:', error);
    return NextResponse.json(
      { error: 'No se pudieron cargar los logs', success: false },
      { status: 500 }
    );
  }
}
