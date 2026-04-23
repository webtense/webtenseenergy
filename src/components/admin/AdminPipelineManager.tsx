'use client';

import { useState } from 'react';

type LeadNote = {
  id: string;
  body: string;
  createdAt: string;
  adminUser?: { username?: string } | null;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  source: string;
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'WON' | 'LOST' | 'SPAM';
  createdAt: string;
  notes: LeadNote[];
};

type Study = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  method: string;
  status: 'NEW' | 'REVIEWING' | 'QUOTED' | 'WON' | 'LOST';
  fileName: string | null;
  createdAt: string;
};

type Props = {
  initialLeads: Lead[];
  initialStudies: Study[];
};

export function AdminPipelineManager({ initialLeads, initialStudies }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [studies, setStudies] = useState(initialStudies);
  const [status, setStatus] = useState('');
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});

  const updateLeadStatus = async (id: string, nextStatus: Lead['status']) => {
    const note = leadNotes[id]?.trim();
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus, note: note || undefined }),
    });

    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      setStatus(payload.message || 'No se pudo actualizar el lead.');
      return;
    }

    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead))
    );
    setLeadNotes((prev) => ({ ...prev, [id]: '' }));
    setStatus('Lead actualizado.');
  };

  const updateStudyStatus = async (id: string, nextStatus: Study['status']) => {
    const response = await fetch(`/api/admin/studies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      setStatus(payload.message || 'No se pudo actualizar la solicitud.');
      return;
    }

    setStudies((prev) =>
      prev.map((study) => (study.id === id ? { ...study, status: nextStatus } : study))
    );
    setStatus('Solicitud actualizada.');
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Leads</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Solicitudes de contacto persistidas con estado comercial y notas.
          </p>
        </div>
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-white/10 bg-zinc-950 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-zinc-100">{lead.name}</p>
                  <p className="text-sm text-zinc-400">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ''}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {lead.subject || 'Sin asunto'} · {lead.source} ·{' '}
                    {new Date(lead.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
                <select
                  value={lead.status}
                  onChange={(event) =>
                    updateLeadStatus(lead.id, event.target.value as Lead['status'])
                  }
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="NEW">NEW</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                  <option value="SPAM">SPAM</option>
                </select>
              </div>
              <textarea
                value={leadNotes[lead.id] || ''}
                onChange={(event) =>
                  setLeadNotes((prev) => ({ ...prev, [lead.id]: event.target.value }))
                }
                placeholder="Añadir nota interna opcional"
                className="mt-3 h-20 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              />
              {lead.notes.length > 0 && (
                <div className="mt-3 space-y-2">
                  {lead.notes.slice(0, 3).map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-xs text-zinc-300"
                    >
                      <p>{note.body}</p>
                      <p className="mt-1 text-zinc-500">
                        {note.adminUser?.username || 'admin'} ·{' '}
                        {new Date(note.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {leads.length === 0 && (
            <p className="text-sm text-zinc-500">Todavia no hay leads persistidos.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Estudios energeticos</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Solicitudes del wizard con estado de revision y datos de adjunto.
          </p>
        </div>
        <div className="space-y-4">
          {studies.map((study) => (
            <div key={study.id} className="rounded-xl border border-white/10 bg-zinc-950 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-zinc-100">{study.name}</p>
                  <p className="text-sm text-zinc-400">
                    {study.email}
                    {study.phone ? ` · ${study.phone}` : ''}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {study.company || 'Sin compania'} · {study.method} ·{' '}
                    {study.fileName || 'Sin adjunto'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(study.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
                <select
                  value={study.status}
                  onChange={(event) =>
                    updateStudyStatus(study.id, event.target.value as Study['status'])
                  }
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="NEW">NEW</option>
                  <option value="REVIEWING">REVIEWING</option>
                  <option value="QUOTED">QUOTED</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
            </div>
          ))}
          {studies.length === 0 && (
            <p className="text-sm text-zinc-500">Todavia no hay estudios persistidos.</p>
          )}
        </div>
      </section>

      {status && (
        <p className="rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm">
          {status}
        </p>
      )}
    </div>
  );
}
