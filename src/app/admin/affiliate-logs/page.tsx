'use client';

import { useEffect, useState } from 'react';

interface LogEntry {
  Fecha: string;
  Fabricante: string;
  Email: string;
  Estado: string;
  Mensaje: string;
}

interface Stats {
  total: number;
  enviados: number;
  errores: number;
  duplicados: number;
}

export default function AffiliateLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, enviados: 0, errores: 0, duplicados: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/affiliate-logs');
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setStats(data.stats);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'ENVIADO':
        return 'bg-green-50 text-green-700';
      case 'ERROR':
        return 'bg-red-50 text-red-700';
      case 'SKIP':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'ENVIADO':
        return '✅';
      case 'ERROR':
        return '❌';
      case 'SKIP':
        return '⏭️';
      default:
        return '📧';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📧 Affiliate Automation Logs</h1>
          <p className="text-gray-600">Seguimiento de envíos de propuestas a fabricantes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">Total</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-2">Enviados</div>
            <div className="text-3xl font-bold text-green-600">✅ {stats.enviados}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="text-sm text-gray-600 mb-2">Errores</div>
            <div className="text-3xl font-bold text-red-600">❌ {stats.errores}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
            <div className="text-sm text-gray-600 mb-2">Duplicados</div>
            <div className="text-3xl font-bold text-gray-600">⏭️ {stats.duplicados}</div>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            <p className="text-gray-600 mt-4">Cargando logs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Tabla de logs */}
        {!loading && logs.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">Historial de envíos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fabricante</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mensaje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(log.Fecha).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.Fabricante}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 break-all">
                        <a href={`mailto:${log.Email}`} className="text-blue-600 hover:underline">
                          {log.Email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.Estado)}`}>
                          {getStatusIcon(log.Estado)} {log.Estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.Mensaje || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && logs.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">📭 Sin registros aún. El primer envío será el {new Date().getDate() + 1} a las 20:00.</p>
          </div>
        )}
      </div>
    </div>
  );
}
