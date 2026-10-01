'use client';

import { useEffect, useState } from 'react';

interface Contact {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  estado: 'prospect' | 'engaged' | 'negotiating' | 'cliente';
  valor_estimado: number;
  ultima_contacto: string;
  proximo_seguimiento: string;
  notas: string;
}

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    prospects: 0,
    engaged: 0,
    negocios: 0,
    valor_total: 0,
  });

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/crm/contacts');
      const data = await response.json();
      setContacts(data.contacts || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching CRM:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'prospect':
        return 'bg-gray-100 text-gray-800';
      case 'engaged':
        return 'bg-blue-100 text-blue-800';
      case 'negotiating':
        return 'bg-amber-100 text-amber-800';
      case 'cliente':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <p className="text-gray-600 mt-4">Cargando CRM (Notion)...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💼 CRM — Notion Integration</h1>
          <p className="text-gray-600">Gestión de contactos, prospects y negocios en curso</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">Total Contactos</div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
            <div className="text-sm text-gray-600 mb-2">Prospects</div>
            <div className="text-3xl font-bold text-gray-600">{stats.prospects}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">Engaged</div>
            <div className="text-3xl font-bold text-blue-600">{stats.engaged}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
            <div className="text-sm text-gray-600 mb-2">Negociando</div>
            <div className="text-3xl font-bold text-amber-600">{stats.negocios}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-2">Valor Total</div>
            <div className="text-3xl font-bold text-green-600">€{stats.valor_total.toLocaleString()}</div>
          </div>
        </div>

        {/* Tabla de contactos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">📋 Contactos</h2>
          </div>

          {contacts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No hay contactos sincronizados aún.</p>
              <p className="text-sm mt-2">
                Conecta tu base de datos Notion para comenzar. Usa el formulario{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  aquí
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Último contacto</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Próximo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact: typeof contacts[0]) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{contact.nombre}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contact.empresa}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(contact.estado)}`}>
                          {contact.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">€{contact.valor_estimado.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contact.ultima_contacto}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{contact.proximo_seguimiento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <strong>🔗 Cómo conectar Notion:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Crea una integración en Notion → Settings → Integrations → New integration</li>
            <li>Copia el Token y la Database ID</li>
            <li>Pégalos aquí para sincronizar automáticamente</li>
            <li>El CRM se actualizará cada 5 minutos</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
