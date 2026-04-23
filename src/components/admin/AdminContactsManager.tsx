'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type LeadItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'WON' | 'LOST' | 'SPAM';
  locale: 'ES' | 'CA';
  originPath: string | null;
  ipHash: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
  contactedAt: string | null;
  wonAt: string | null;
  lostAt: string | null;
  notes: Array<{
    id: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    adminUser: { username: string } | null;
  }>;
};

type StudyItem = {
  id: string;
  method: string;
  fileName: string | null;
  fileMimeType: string | null;
  fileSizeBytes: number | null;
  kwConsumed: string | null;
  habits: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  status: 'NEW' | 'REVIEWING' | 'QUOTED' | 'WON' | 'LOST';
  locale: 'ES' | 'CA';
  originPath: string | null;
  ipHash: string | null;
  userAgent: string | null;
  reviewedAt: string | null;
  quotedAt: string | null;
  wonAt: string | null;
  lostAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type SubscriberItem = {
  id: string;
  email: string;
  fullName: string | null;
  locale: 'ES' | 'CA';
  isActive: boolean;
  source: string;
  consentedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
  consents: Array<{
    id: string;
    legalText: string;
    ipAddress: string | null;
    userAgent: string | null;
    acceptedAt: string;
  }>;
  events: Array<{
    id: string;
    eventType: string;
    createdAt: string;
    sendJob: {
      id: string;
      status: string;
      runAt: string;
      finishedAt: string | null;
      createdAt: string;
      updatedAt: string;
      campaign: {
        id: string;
        name: string;
        status: string;
        subject: string;
        preheader: string | null;
        scheduledFor: string | null;
        sentAt: string | null;
        createdAt: string;
        updatedAt: string;
      };
    };
  }>;
};

type ActivityCampaign = {
  id: string;
  name: string;
  subject: string;
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ActivityLog = {
  id: string;
  channel: string;
  destination: string;
  subject: string;
  status: string;
  entityType: string | null;
  entityId: string | null;
  providerMessageId: string | null;
  error: string | null;
  payload: string | null;
  sentAt: string | null;
  createdAt: string;
};

type Props = {
  initialLeads: LeadItem[];
  initialStudies: StudyItem[];
  initialSubscribers: SubscriberItem[];
  recentCampaigns: ActivityCampaign[];
  recentEmailLogs: ActivityLog[];
};

type TabKey = 'leads' | 'studies' | 'subscribers' | 'activity';

const pageSize = 20;

function formatDate(value: string | null) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(value)
  );
}

export function AdminContactsManager({
  initialLeads,
  initialStudies,
  initialSubscribers,
  recentCampaigns,
  recentEmailLogs,
}: Props) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'leads';

  const [tab, setTab] = useState<TabKey>(
    ['leads', 'studies', 'subscribers', 'activity'].includes(initialTab) ? initialTab : 'leads'
  );
  const [search, setSearch] = useState('');
  const [leadStatus, setLeadStatus] = useState<Record<string, LeadItem['status']>>({});
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});
  const [studyStatus, setStudyStatus] = useState<Record<string, StudyItem['status']>>({});
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [leads, setLeads] = useState(initialLeads);
  const [studies, setStudies] = useState(initialStudies);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredLeads = useMemo(
    () =>
      leads.filter((item) =>
        [item.name, item.email, item.phone || '', item.source, item.subject || '', item.message]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [leads, search]
  );
  const filteredStudies = useMemo(
    () =>
      studies.filter((item) =>
        [item.name, item.email, item.phone || '', item.company || '', item.source, item.method]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [studies, search]
  );
  const filteredSubscribers = useMemo(
    () =>
      subscribers.filter((item) =>
        [item.email, item.fullName || '', item.source]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [subscribers, search]
  );

  const pagedItems = useMemo(() => {
    const source =
      tab === 'leads' ? filteredLeads : tab === 'studies' ? filteredStudies : filteredSubscribers;
    return source.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredLeads, filteredStudies, filteredSubscribers, page, tab]);

  const selectedLead =
    leads.find((item) => item.id === selectedId) ||
    (tab === 'leads' ? (pagedItems[0] as LeadItem | undefined) : undefined);
  const selectedStudy =
    studies.find((item) => item.id === selectedId) ||
    (tab === 'studies' ? (pagedItems[0] as StudyItem | undefined) : undefined);
  const selectedSubscriber =
    subscribers.find((item) => item.id === selectedId) ||
    (tab === 'subscribers' ? (pagedItems[0] as SubscriberItem | undefined) : undefined);

  const changeTab = (nextTab: TabKey) => {
    setTab(nextTab);
    setPage(1);
    setSelectedId(null);
    setMessage('');
  };

  const saveLead = async (lead: LeadItem) => {
    setSavingId(lead.id);
    setMessage('');
    const response = await fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: leadStatus[lead.id] || lead.status,
        note: leadNotes[lead.id] || '',
      }),
    });
    const payload = (await response.json()) as { lead?: LeadItem; message?: string };
    if (!response.ok || !payload.lead) {
      setMessage(payload.message || 'No se pudo actualizar el lead.');
      setSavingId(null);
      return;
    }

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              ...payload.lead,
              createdAt: item.createdAt,
              updatedAt: new Date().toISOString(),
              notes: leadNotes[lead.id]
                ? [
                    {
                      id: `${Date.now()}`,
                      body: leadNotes[lead.id],
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      adminUser: { username: 'admin' },
                    },
                    ...item.notes,
                  ]
                : item.notes,
            }
          : item
      )
    );
    setLeadNotes((current) => ({ ...current, [lead.id]: '' }));
    setMessage('Lead actualizado.');
    setSavingId(null);
  };

  const saveStudy = async (study: StudyItem) => {
    setSavingId(study.id);
    setMessage('');
    const response = await fetch(`/api/admin/studies/${study.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: studyStatus[study.id] || study.status }),
    });
    const payload = (await response.json()) as { study?: StudyItem; message?: string };
    if (!response.ok || !payload.study) {
      setMessage(payload.message || 'No se pudo actualizar el estudio.');
      setSavingId(null);
      return;
    }

    setStudies((current) =>
      current.map((item) =>
        item.id === study.id
          ? {
              ...item,
              ...payload.study,
              createdAt: item.createdAt,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    setMessage('Solicitud actualizada.');
    setSavingId(null);
  };

  const toggleSubscriber = async (subscriber: SubscriberItem) => {
    setSavingId(subscriber.id);
    setMessage('');
    const response = await fetch(`/api/admin/subscribers/${subscriber.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !subscriber.isActive }),
    });
    const payload = (await response.json()) as { subscriber?: SubscriberItem; message?: string };
    if (!response.ok || !payload.subscriber) {
      setMessage(payload.message || 'No se pudo actualizar el suscriptor.');
      setSavingId(null);
      return;
    }

    setSubscribers((current) =>
      current.map((item) =>
        item.id === subscriber.id
          ? {
              ...item,
              ...payload.subscriber,
              consents: item.consents,
              events: item.events,
              createdAt: item.createdAt,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    setMessage(`Suscriptor ${payload.subscriber.isActive ? 'reactivado' : 'desactivado'}.`);
    setSavingId(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Contactos</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Hub de personas y actividad</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Unifica leads, estudios, suscriptores y el rastro comercial que ya existe en la base de
          datos.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(
            [
              ['leads', `Leads (${leads.length})`],
              ['studies', `Estudios (${studies.length})`],
              ['subscribers', `Suscriptores (${subscribers.length})`],
              ['activity', 'Actividad'],
            ] as Array<[TabKey, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => changeTab(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === value ? 'bg-primary-600 text-white' : 'border border-white/10 bg-zinc-950 text-zinc-300 hover:border-white/20'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, email, origen, telefono..."
            className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none md:max-w-md"
          />
          {tab !== 'activity' && (
            <a
              href={`/api/admin/contacts/export?type=${tab}`}
              className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-primary-500 hover:text-primary-300"
            >
              Exportar CSV
            </a>
          )}
        </div>
        {message && (
          <p className="mt-4 rounded-2xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            {message}
          </p>
        )}
      </section>

      {tab === 'activity' ? (
        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
            <h3 className="text-xl font-semibold text-white">Campanas recientes</h3>
            <div className="mt-4 space-y-3">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3"
                >
                  <p className="font-semibold text-zinc-100">{campaign.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{campaign.subject}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {campaign.status} · enviada {formatDate(campaign.sentAt)}
                  </p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
            <h3 className="text-xl font-semibold text-white">Email logs</h3>
            <div className="mt-4 space-y-3">
              {recentEmailLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3"
                >
                  <p className="font-semibold text-zinc-100">{log.destination}</p>
                  <p className="mt-1 text-sm text-zinc-400">{log.subject}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {log.status} · {formatDate(log.createdAt)}
                  </p>
                  {log.error && <p className="mt-2 text-xs text-red-300">{log.error}</p>}
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-4">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-zinc-950/80 text-left text-xs uppercase tracking-[0.16em] text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Contacto</th>
                    <th className="px-4 py-3">Origen</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-zinc-900/40">
                  {pagedItems.map((item) => {
                    const key = item.id;
                    const active =
                      selectedId === key ||
                      (!selectedId &&
                        ((tab === 'leads' && selectedLead?.id === key) ||
                          (tab === 'studies' && selectedStudy?.id === key) ||
                          (tab === 'subscribers' && selectedSubscriber?.id === key)));
                    return (
                      <tr
                        key={key}
                        className={`cursor-pointer transition ${active ? 'bg-primary-500/10' : 'hover:bg-white/5'}`}
                        onClick={() => setSelectedId(key)}
                      >
                        <td className="px-4 py-3 text-zinc-200">
                          {'fullName' in item ? item.fullName || item.email : item.name}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{item.email}</td>
                        <td className="px-4 py-3 text-zinc-400">{item.source}</td>
                        <td className="px-4 py-3 text-zinc-400">
                          {'isActive' in item
                            ? item.isActive
                              ? 'ACTIVE'
                              : 'INACTIVE'
                            : item.status}
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{formatDate(item.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <p>Pagina {page}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-xl border border-white/10 px-3 py-2 hover:border-white/20"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl border border-white/10 px-3 py-2 hover:border-white/20"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
            {tab === 'leads' && selectedLead && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-primary-400">Lead</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{selectedLead.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{selectedLead.email}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
                  <p>
                    <strong>Telefono:</strong> {selectedLead.phone || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Asunto:</strong> {selectedLead.subject || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Origen:</strong> {selectedLead.source}
                  </p>
                  <p className="mt-2">
                    <strong>Path:</strong> {selectedLead.originPath || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Alta:</strong> {formatDate(selectedLead.createdAt)}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap text-zinc-400">{selectedLead.message}</p>
                </div>
                <select
                  value={leadStatus[selectedLead.id] || selectedLead.status}
                  onChange={(event) =>
                    setLeadStatus((current) => ({
                      ...current,
                      [selectedLead.id]: event.target.value as LeadItem['status'],
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
                >
                  {(['NEW', 'QUALIFIED', 'CONTACTED', 'WON', 'LOST', 'SPAM'] as const).map(
                    (value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                  )}
                </select>
                <textarea
                  value={leadNotes[selectedLead.id] || ''}
                  onChange={(event) =>
                    setLeadNotes((current) => ({
                      ...current,
                      [selectedLead.id]: event.target.value,
                    }))
                  }
                  placeholder="Anadir nota comercial"
                  className="h-28 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => saveLead(selectedLead)}
                  disabled={savingId === selectedLead.id}
                  className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-500 disabled:opacity-60"
                >
                  {savingId === selectedLead.id ? 'Guardando...' : 'Guardar lead'}
                </button>
                <div>
                  <p className="text-sm font-semibold text-white">Historial</p>
                  <div className="mt-3 space-y-2">
                    {selectedLead.notes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-2xl border border-white/10 bg-zinc-950 p-3 text-sm text-zinc-300"
                      >
                        <p>{note.body}</p>
                        <p className="mt-2 text-xs text-zinc-500">
                          {note.adminUser?.username || 'admin'} · {formatDate(note.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'studies' && selectedStudy && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-primary-400">Solicitud</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{selectedStudy.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{selectedStudy.email}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
                  <p>
                    <strong>Telefono:</strong> {selectedStudy.phone || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Empresa:</strong> {selectedStudy.company || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Metodo:</strong> {selectedStudy.method}
                  </p>
                  <p className="mt-2">
                    <strong>Consumo:</strong> {selectedStudy.kwConsumed || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Archivo:</strong> {selectedStudy.fileName || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Path:</strong> {selectedStudy.originPath || '-'}
                  </p>
                  <p className="mt-2">
                    <strong>Alta:</strong> {formatDate(selectedStudy.createdAt)}
                  </p>
                </div>
                <select
                  value={studyStatus[selectedStudy.id] || selectedStudy.status}
                  onChange={(event) =>
                    setStudyStatus((current) => ({
                      ...current,
                      [selectedStudy.id]: event.target.value as StudyItem['status'],
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
                >
                  {(['NEW', 'REVIEWING', 'QUOTED', 'WON', 'LOST'] as const).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => saveStudy(selectedStudy)}
                  disabled={savingId === selectedStudy.id}
                  className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-500 disabled:opacity-60"
                >
                  {savingId === selectedStudy.id ? 'Guardando...' : 'Guardar estudio'}
                </button>
              </div>
            )}

            {tab === 'subscribers' && selectedSubscriber && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-primary-400">Suscriptor</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {selectedSubscriber.fullName || selectedSubscriber.email}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{selectedSubscriber.email}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
                  <p>
                    <strong>Estado:</strong> {selectedSubscriber.isActive ? 'Activo' : 'Inactivo'}
                  </p>
                  <p className="mt-2">
                    <strong>Origen:</strong> {selectedSubscriber.source}
                  </p>
                  <p className="mt-2">
                    <strong>Locale:</strong> {selectedSubscriber.locale}
                  </p>
                  <p className="mt-2">
                    <strong>Consentido:</strong> {formatDate(selectedSubscriber.consentedAt)}
                  </p>
                  <p className="mt-2">
                    <strong>Alta:</strong> {formatDate(selectedSubscriber.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSubscriber(selectedSubscriber)}
                  disabled={savingId === selectedSubscriber.id}
                  className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-500 disabled:opacity-60"
                >
                  {savingId === selectedSubscriber.id
                    ? 'Guardando...'
                    : selectedSubscriber.isActive
                      ? 'Desactivar'
                      : 'Reactivar'}
                </button>
                <div>
                  <p className="text-sm font-semibold text-white">Consentimientos</p>
                  <div className="mt-3 space-y-2">
                    {selectedSubscriber.consents.map((consent) => (
                      <div
                        key={consent.id}
                        className="rounded-2xl border border-white/10 bg-zinc-950 p-3 text-sm text-zinc-300"
                      >
                        <p>{consent.legalText}</p>
                        <p className="mt-2 text-xs text-zinc-500">
                          {formatDate(consent.acceptedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Eventos de envio</p>
                  <div className="mt-3 space-y-2">
                    {selectedSubscriber.events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-2xl border border-white/10 bg-zinc-950 p-3 text-sm text-zinc-300"
                      >
                        <p>
                          {event.eventType} · {event.sendJob.campaign.name}
                        </p>
                        <p className="mt-2 text-xs text-zinc-500">{formatDate(event.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}
