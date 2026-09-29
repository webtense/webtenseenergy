'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ROIData {
  revenue: {
    affiliate: number;
    sponsors: number;
    total: number;
  };
  metrics: {
    emails_sent: number;
    responses: number;
    conversion_rate: number;
    cost_per_response: number;
  };
  sources: Array<{
    name: string;
    revenue: number;
    percentage: number;
    color: string;
  }>;
  projection: Array<{
    month: string;
    conservative: number;
    optimistic: number;
    realistic: number;
  }>;
}

const COLORS = ['#1ab775', '#3b76f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ROIDashboard() {
  const [data, setData] = useState<ROIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchROIData();
    const interval = setInterval(fetchROIData, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const fetchROIData = async () => {
    try {
      const response = await fetch('/api/admin/roi-data');
      const roi = await response.json();
      setData(roi);
    } catch (error) {
      console.error('Error fetching ROI data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <p className="text-gray-600 mt-4">Cargando dashboard ROI...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No hay datos disponibles aún. El dashboard se actualizará cuando haya actividad.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 ROI Dashboard</h1>
          <p className="text-gray-600">Análisis de revenue y ROI de automatizaciones</p>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-2">Revenue Total</div>
            <div className="text-3xl font-bold text-green-600">€{data.revenue.total.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-2">Este mes</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">Emails Enviados</div>
            <div className="text-3xl font-bold text-blue-600">{data.metrics.emails_sent}</div>
            <div className="text-xs text-gray-500 mt-2">Affiliate + Sponsors</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-2">Tasa Conversión</div>
            <div className="text-3xl font-bold text-purple-600">{data.metrics.conversion_rate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-2">{data.metrics.responses} respuestas</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
            <div className="text-sm text-gray-600 mb-2">Costo por Respuesta</div>
            <div className="text-3xl font-bold text-amber-600">€{data.metrics.cost_per_response.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-2">ROI real</div>
          </div>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue por fuente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Revenue por Fuente</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.sources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {data.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Proyección */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Proyección 12 Meses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.projection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `€${value.toFixed(0)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="conservative"
                  stroke="#6b7280"
                  name="Conservadora"
                  strokeDasharray="5 5"
                />
                <Line type="monotone" dataKey="realistic" stroke="#1ab775" name="Realista" />
                <Line
                  type="monotone"
                  dataKey="optimistic"
                  stroke="#3b76f6"
                  name="Optimista"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumen detallado */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Análisis Detallado</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Affiliate Amazon</h3>
              <p className="text-2xl font-bold text-green-600">€{data.revenue.affiliate.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Comisiones (3-5%)</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">B2B Sponsors</h3>
              <p className="text-2xl font-bold text-blue-600">€{data.revenue.sponsors.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Patrocinio directo</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Eficiencia</h3>
              <p className="text-2xl font-bold text-purple-600">
                {((data.revenue.total / (data.metrics.emails_sent || 1)) * 100).toFixed(1)}€/email
              </p>
              <p className="text-sm text-gray-600 mt-1">Revenue por envío</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <strong>📌 Nota:</strong> Los datos se actualizan cada minuto desde los logs de automatización.
          El ROI real depende de las respuestas reales de sponsors y conversiones de affiliate.
        </div>
      </div>
    </div>
  );
}
