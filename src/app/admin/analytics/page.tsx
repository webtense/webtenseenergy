'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  pageviews: number;
  sessions: number;
  users: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number; conversions: number }>;
  trafficSources: Array<{ source: string; sessions: number; percentage: number }>;
  dailyMetrics: Array<{ date: string; pageviews: number; conversions: number }>;
}

const SAMPLE_DATA: AnalyticsData = {
  pageviews: 4250,
  sessions: 1680,
  users: 1204,
  avgSessionDuration: 4.2,
  bounceRate: 38.5,
  conversionRate: 3.2,
  topPages: [
    { page: '/guia-paneles-solares', views: 892, conversions: 28 },
    { page: '/blog/inversor-barato', views: 745, conversions: 24 },
    { page: '/productos/bateria-victron', views: 623, conversions: 20 },
    { page: '/comparativa-2026', views: 445, conversions: 14 },
  ],
  trafficSources: [
    { source: 'Organic Search', sessions: 784, percentage: 46.7 },
    { source: 'Direct', sessions: 456, percentage: 27.1 },
    { source: 'Referral', sessions: 268, percentage: 16.0 },
    { source: 'Social', sessions: 172, percentage: 10.2 },
  ],
  dailyMetrics: [
    { date: 'Lun', pageviews: 420, conversions: 13 },
    { date: 'Mar', pageviews: 380, conversions: 12 },
    { date: 'Mié', pageviews: 510, conversions: 16 },
    { date: 'Jue', pageviews: 640, conversions: 21 },
    { date: 'Vie', pageviews: 720, conversions: 23 },
    { date: 'Sáb', pageviews: 580, conversions: 18 },
  ],
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(SAMPLE_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En producción, llamar a /api/admin/analytics/data
    // que integrará Google Analytics API
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <p className="text-gray-600 mt-4">Cargando datos de Google Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Google Analytics</h1>
          <p className="text-gray-600">Últimos 30 días — Traffic y Conversiones</p>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">Page Views</div>
            <div className="text-3xl font-bold text-blue-600">{data.pageviews.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">+12% vs período anterior</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-2">Conversiones</div>
            <div className="text-3xl font-bold text-green-600">{Math.round(data.pageviews * data.conversionRate / 100)}</div>
            <div className="text-xs text-gray-500 mt-2">Tasa: {data.conversionRate}%</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-2">Usuarios Únicos</div>
            <div className="text-3xl font-bold text-purple-600">{data.users.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Sesiones: {data.sessions.toLocaleString()}</div>
          </div>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend diario */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Tendencia Diaria</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="pageviews"
                  stroke="#3b76f6"
                  name="Page Views"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversions"
                  stroke="#1ab775"
                  name="Conversiones"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top pages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🏆 Páginas Principales</h2>
            <div className="space-y-4">
              {data.topPages.map((page: typeof pages[0]) => (
                <div key={page.page} className="border-b border-gray-200 pb-3">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{page.page}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full"
                          style={{ width: `${(page.views / data.topPages[0].views) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm text-gray-600">{page.views} views</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">{page.conversions} conversiones</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Fuentes de Tráfico</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.trafficSources.map((source: typeof sources[0]) => (
              <div key={source.source} className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="font-semibold text-gray-900">{source.source}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{source.sessions}</p>
                <p className="text-sm text-gray-600 mt-1">{source.percentage}% del tráfico</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <strong>⚠️ Nota de Integración:</strong> Google Analytics API se integrará cuando proporciones el Property ID.
          Por ahora se muestran datos de muestra. Estructura pronta para actualizaciones en tiempo real.
        </div>
      </div>
    </div>
  );
}
