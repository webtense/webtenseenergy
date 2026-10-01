'use client';

import { useEffect, useState } from 'react';

interface Response {
  timestamp: string;
  mensaje_id: string;
  de: string;
  asunto: string;
  fecha: string;
  preview: string;
  tipo: string;
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    nuevas: 0,
    por_tipo: {} as Record<string, number>,
  });

  useEffect(() => {
    fetchResponses();
    const interval = setInterval(fetchResponses, 120000); // Actualizar cada 2 minutos
    return () => clearInterval(interval);
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/admin/responses');
      const data = await response.json();
      setResponses(data.responses || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <p className="text-gray-600 mt-4">Cargando respuestas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📬 Respuestas Detectadas</h1>
          <p className="text-gray-600">Gmail API — respuestas de fabricantes y sponsors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-2">Total Respuestas</div>
            <div className="text-3xl font-bold text-green-600">{stats.total}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">Nuevas (Hoy)</div>
            <div className="text-3xl font-bold text-blue-600">{stats.nuevas}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-2">Fabricantes</div>
            <div className="text-3xl font-bold text-purple-600">{stats.por_tipo['respuesta_fabricante'] || 0}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
            <div className="text-sm text-gray-600 mb-2">Sponsors</div>
            <div className="text-3xl font-bold text-amber-600">{stats.por_tipo['respuesta_sponsor'] || 0}</div>
          </div>
        </div>

        {/* Respuestas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">📧 Respuestas Recibidas</h2>
          </div>

          {responses.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No hay respuestas detectadas aún.</p>
              <p className="text-sm mt-2">Las respuestas se sincronizan cada 2 minutos desde Gmail.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {responses.map((resp: typeof resps[0]) => (
                <div key={resp.mensaje_id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{resp.de}</p>
                      <p className="text-sm text-gray-600 mt-1">{resp.asunto}</p>
                      <p className="text-xs text-gray-500 mt-2">{resp.fecha}</p>
                      <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-2 rounded line-clamp-2">
                        {resp.preview}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        resp.tipo === 'respuesta_fabricante'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {resp.tipo === 'respuesta_fabricante' ? '🏭 Fabricante' : '💼 Sponsor'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <strong>📌 Nota:</strong> Las respuestas se detectan automáticamente cada 2 minutos mediante Gmail API.
          Los datos se sincronizan desde `/opt/webtenseenergy/gmail_responses_detected.json`.
        </div>
      </div>
    </div>
  );
}
