"use client";

import { useMemo, useState } from "react";

type CampaignBlockItem = { id: string; sortOrder: number; type: string; content: string; createdAt: string; updatedAt: string };
type CampaignItem = {
  id: string;
  name: string;
  locale: "ES" | "CA";
  subject: string;
  preheader: string | null;
  status: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "FAILED";
  scheduleType: "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE" | null;
  scheduledFor: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  blocks: CampaignBlockItem[];
};
type SubscriberItem = { id: string; email: string; fullName: string | null; isActive: boolean; createdAt: string; consentedAt: string | null; unsubscribedAt: string | null; locale: "ES" | "CA"; source: string; updatedAt: string };
type JobItem = { id: string; status: string; runAt: string; finishedAt: string | null; error: string | null; createdAt: string; updatedAt: string; campaign: { id: string; name: string; subject: string; status: string; scheduledFor: string | null; sentAt: string | null; createdAt: string; updatedAt: string; locale: "ES" | "CA"; preheader: string | null } };
type EventItem = { id: string; eventType: string; createdAt: string; subscriber: { id: string; email: string; fullName: string | null; locale: "ES" | "CA"; isActive: boolean; source: string; consentedAt: string | null; unsubscribedAt: string | null; createdAt: string; updatedAt: string }; sendJob: JobItem };
type LogItem = { id: string; destination: string; subject: string; status: string; error: string | null; createdAt: string; sentAt: string | null; channel: string; entityType: string | null; entityId: string | null; providerMessageId: string | null; payload: string | null };

type AudienceRules = {
  locale: "ALL" | "ES" | "CA";
  sources: string[];
  requireConsent: boolean;
  activeWithinDays: number | null;
};

type Props = {
  initialCampaigns: CampaignItem[];
  initialSubscribers: SubscriberItem[];
  initialJobs: JobItem[];
  initialEvents: EventItem[];
  initialLogs: LogItem[];
};

type Draft = {
  id?: string;
  name: string;
  locale: "ES" | "CA";
  subject: string;
  preheader: string;
  status: CampaignItem["status"];
  scheduleType: CampaignItem["scheduleType"];
  scheduledFor: string;
  blocks: Array<{ id?: string; sortOrder: number; type: string; content: string }>;
};

const DEFAULT_AUDIENCE: AudienceRules = {
  locale: "ALL",
  sources: [],
  requireConsent: true,
  activeWithinDays: null,
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function parseAudience(value: string | undefined): AudienceRules {
  if (!value) return DEFAULT_AUDIENCE;

  try {
    const parsed = JSON.parse(value) as Partial<AudienceRules>;
    return {
      locale: parsed.locale === "ES" || parsed.locale === "CA" ? parsed.locale : "ALL",
      sources: Array.isArray(parsed.sources) ? parsed.sources.map((entry) => String(entry).trim()).filter(Boolean) : [],
      requireConsent: parsed.requireConsent !== false,
      activeWithinDays: typeof parsed.activeWithinDays === "number" && parsed.activeWithinDays > 0 ? parsed.activeWithinDays : null,
    };
  } catch {
    return DEFAULT_AUDIENCE;
  }
}

function ensureAudienceBlock(blocks: Draft["blocks"], nextAudience?: AudienceRules) {
  const audience = nextAudience || parseAudience(blocks.find((block) => block.type === "audience")?.content);
  const payload = JSON.stringify(audience);
  const existing = blocks.find((block) => block.type === "audience");

  if (existing) {
    return blocks.map((block) => block.type === "audience" ? { ...block, sortOrder: 0, content: payload } : block);
  }

  return [{ sortOrder: 0, type: "audience", content: payload }, ...blocks];
}

function getAudienceFromDraft(blocks: Draft["blocks"]) {
  return parseAudience(blocks.find((block) => block.type === "audience")?.content);
}

function estimateRecipients(subscribers: SubscriberItem[], audience: AudienceRules) {
  const now = Date.now();

  return subscribers.filter((subscriber) => {
    if (!subscriber.isActive) return false;
    if (audience.locale !== "ALL" && subscriber.locale !== audience.locale) return false;
    if (audience.sources.length > 0 && !audience.sources.includes(subscriber.source)) return false;
    if (audience.requireConsent && !subscriber.consentedAt) return false;
    if (audience.activeWithinDays) {
      const threshold = now - audience.activeWithinDays * 24 * 60 * 60 * 1000;
      if (new Date(subscriber.createdAt).getTime() < threshold) return false;
    }
    return true;
  }).length;
}

function emptyDraft(): Draft {
  return {
    name: "",
    locale: "ES",
    subject: "",
    preheader: "",
    status: "DRAFT",
    scheduleType: null,
    scheduledFor: "",
    blocks: ensureAudienceBlock([
      { sortOrder: 1, type: "intro", content: "Resumen breve de la newsletter." },
      { sortOrder: 2, type: "posts", content: "[]" },
      { sortOrder: 3, type: "offers", content: "[]" },
      { sortOrder: 4, type: "cta", content: '{"label":"Abrir web","url":"https://webtenseenergy.com"}' },
    ]),
  };
}

export function AdminNewsletterManager({ initialCampaigns, initialSubscribers, initialJobs, initialEvents, initialLogs }: Props) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedId, setSelectedId] = useState<string | null>(initialCampaigns[0]?.id || null);
  const [draft, setDraft] = useState<Draft>(() => initialCampaigns[0] ? {
    id: initialCampaigns[0].id,
    name: initialCampaigns[0].name,
    locale: initialCampaigns[0].locale,
    subject: initialCampaigns[0].subject,
    preheader: initialCampaigns[0].preheader || "",
    status: initialCampaigns[0].status,
    scheduleType: initialCampaigns[0].scheduleType,
    scheduledFor: initialCampaigns[0].scheduledFor ? initialCampaigns[0].scheduledFor.slice(0, 16) : "",
    blocks: ensureAudienceBlock(initialCampaigns[0].blocks.map((block) => ({ id: block.id, sortOrder: block.sortOrder, type: block.type, content: block.content }))),
  } : emptyDraft());
  const [jobs] = useState(initialJobs);
  const [events] = useState(initialEvents);
  const [logs] = useState(initialLogs);
  const [testEmail, setTestEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCampaign = useMemo(() => campaigns.find((campaign) => campaign.id === selectedId) || null, [campaigns, selectedId]);
  const audience = useMemo(() => getAudienceFromDraft(draft.blocks), [draft.blocks]);
  const sourceOptions = useMemo(() => Array.from(new Set(initialSubscribers.map((subscriber) => subscriber.source))).sort((left, right) => left.localeCompare(right, "es")), [initialSubscribers]);
  const estimatedRecipients = useMemo(() => estimateRecipients(initialSubscribers, audience), [initialSubscribers, audience]);

  const loadCampaign = (campaign: CampaignItem) => {
    setSelectedId(campaign.id);
    setDraft({
      id: campaign.id,
      name: campaign.name,
      locale: campaign.locale,
      subject: campaign.subject,
      preheader: campaign.preheader || "",
      status: campaign.status,
      scheduleType: campaign.scheduleType,
      scheduledFor: campaign.scheduledFor ? campaign.scheduledFor.slice(0, 16) : "",
      blocks: ensureAudienceBlock(campaign.blocks.map((block) => ({ id: block.id, sortOrder: block.sortOrder, type: block.type, content: block.content }))),
    });
    setMessage("");
  };

  const updateAudience = (nextAudience: AudienceRules) => {
    setDraft((current) => ({ ...current, blocks: ensureAudienceBlock(current.blocks, nextAudience) }));
  };

  const saveCampaign = async () => {
    setBusy(true);
    setMessage("");
    const response = await fetch(draft.id ? `/api/admin/newsletter/campaigns/${draft.id}` : "/api/admin/newsletter/campaigns", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        locale: draft.locale,
        subject: draft.subject,
        preheader: draft.preheader,
        status: draft.status,
        scheduleType: draft.scheduleType,
        scheduledFor: draft.scheduledFor || null,
        blocks: draft.blocks,
      }),
    });
    const payload = (await response.json()) as { campaign?: CampaignItem; message?: string };
    if (!response.ok || !payload.campaign) {
      setMessage(payload.message || "No se pudo guardar la campana.");
      setBusy(false);
      return;
    }

    const normalized = {
      ...payload.campaign,
      scheduledFor: payload.campaign.scheduledFor,
      sentAt: payload.campaign.sentAt,
      createdAt: payload.campaign.createdAt,
      updatedAt: payload.campaign.updatedAt,
      blocks: payload.campaign.blocks,
    };
    setCampaigns((current) => {
      const exists = current.some((campaign) => campaign.id === normalized.id);
      const next = exists ? current.map((campaign) => campaign.id === normalized.id ? normalized : campaign) : [normalized, ...current];
      return [...next].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    });
    loadCampaign(normalized);
    setMessage("Campana guardada.");
    setBusy(false);
  };

  const sendTest = async () => {
    if (!draft.id) {
      setMessage("Guarda la campana antes de enviar una prueba.");
      return;
    }
    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/admin/newsletter/campaigns/${draft.id}/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });
    const payload = (await response.json()) as { message?: string };
    setMessage(response.ok ? "Prueba enviada correctamente." : payload.message || "No se pudo enviar la prueba.");
    setBusy(false);
  };

  const sendNow = async () => {
    if (!draft.id) {
      setMessage("Guarda la campana antes de enviarla.");
      return;
    }
    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/admin/newsletter/campaigns/${draft.id}/send`, { method: "POST" });
    const payload = (await response.json()) as { message?: string; result?: { delivered: number; failed: number } };
    setMessage(response.ok ? `Envio lanzado. Entregados: ${payload.result?.delivered || 0}. Fallidos: ${payload.result?.failed || 0}.` : payload.message || "No se pudo lanzar el envio.");
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Newsletter</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Campanas, bloques y ejecucion</h2>
        <p className="mt-2 text-sm text-zinc-400">Editor funcional para campanas manuales con prueba, envio real y visibilidad de jobs, eventos y logs.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Campanas</p><p className="mt-2 text-3xl font-bold text-white">{campaigns.length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Suscriptores activos</p><p className="mt-2 text-3xl font-bold text-white">{initialSubscribers.filter((item) => item.isActive).length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Ultimos jobs</p><p className="mt-2 text-3xl font-bold text-white">{jobs.length}</p></div>
        </div>
        {message && <p className="mt-4 rounded-2xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">{message}</p>}
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Segmento actual</p>
          <p className="mt-2 text-sm text-zinc-200">
            {audience.locale === "ALL" ? "Todos los idiomas" : `Locale ${audience.locale}`}
            {audience.sources.length ? ` · fuentes: ${audience.sources.join(", ")}` : " · todas las fuentes"}
            {audience.requireConsent ? " · solo consentidos" : " · sin exigir consentimiento"}
            {audience.activeWithinDays ? ` · altas recientes (${audience.activeWithinDays} dias)` : " · sin recorte de antiguedad"}
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-200">Estimacion rapida: {estimatedRecipients} destinatarios</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-white/10 bg-zinc-900/90 p-4">
          <button type="button" onClick={() => { setSelectedId(null); setDraft(emptyDraft()); setMessage(""); }} className="mb-4 w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-500">Nueva campana</button>
          <div className="space-y-2">
            {campaigns.map((campaign) => (
              <button key={campaign.id} type="button" onClick={() => loadCampaign(campaign)} className={`w-full rounded-2xl border px-4 py-3 text-left transition ${selectedId === campaign.id ? "border-primary-500/50 bg-primary-500/10" : "border-white/10 bg-zinc-950 hover:border-white/20"}`}>
                <p className="font-semibold text-zinc-100">{campaign.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{campaign.status} · {formatDate(campaign.updatedAt)}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Nombre de la campana" className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none" />
              <input value={draft.subject} onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))} placeholder="Asunto" className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none" />
              <input value={draft.preheader} onChange={(event) => setDraft((current) => ({ ...current, preheader: event.target.value }))} placeholder="Preheader" className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none md:col-span-2" />
              <select value={draft.locale} onChange={(event) => setDraft((current) => ({ ...current, locale: event.target.value as Draft["locale"] }))} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"><option value="ES">ES</option><option value="CA">CA</option></select>
              <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as Draft["status"] }))} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"><option value="DRAFT">DRAFT</option><option value="SCHEDULED">SCHEDULED</option><option value="SENDING">SENDING</option><option value="SENT">SENT</option><option value="FAILED">FAILED</option></select>
              <select value={draft.scheduleType || ""} onChange={(event) => setDraft((current) => ({ ...current, scheduleType: (event.target.value || null) as Draft["scheduleType"] }))} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"><option value="">Sin programacion</option><option value="ONCE">ONCE</option><option value="DAILY">DAILY</option><option value="WEEKLY">WEEKLY</option><option value="MONTHLY">MONTHLY</option></select>
              <input type="datetime-local" value={draft.scheduledFor} onChange={(event) => setDraft((current) => ({ ...current, scheduledFor: event.target.value }))} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none" />
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <p className="text-sm font-semibold text-white">Segmentacion del envio</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Locale</label>
                  <select value={audience.locale} onChange={(event) => updateAudience({ ...audience, locale: event.target.value as AudienceRules["locale"] })} className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none">
                    <option value="ALL">Todos</option>
                    <option value="ES">ES</option>
                    <option value="CA">CA</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Fuente</label>
                  <select value="" onChange={(event) => {
                    const nextSource = event.target.value;
                    if (!nextSource || audience.sources.includes(nextSource)) return;
                    updateAudience({ ...audience, sources: [...audience.sources, nextSource] });
                  }} className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none">
                    <option value="">Todas</option>
                    {sourceOptions.map((source) => <option key={source} value={source}>{source}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Altas recientes</label>
                  <select value={audience.activeWithinDays?.toString() || ""} onChange={(event) => updateAudience({ ...audience, activeWithinDays: event.target.value ? Number(event.target.value) : null })} className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none">
                    <option value="">Sin filtro</option>
                    <option value="7">Ultimos 7 dias</option>
                    <option value="30">Ultimos 30 dias</option>
                    <option value="90">Ultimos 90 dias</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-200">
                  <input type="checkbox" checked={audience.requireConsent} onChange={(event) => updateAudience({ ...audience, requireConsent: event.target.checked })} className="h-4 w-4 rounded border-white/20 bg-zinc-950" />
                  Solo consentidos
                </label>
              </div>
              {audience.sources.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {audience.sources.map((source) => (
                    <button key={source} type="button" onClick={() => updateAudience({ ...audience, sources: audience.sources.filter((entry) => entry !== source) })} className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-200">
                      {source} ×
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 space-y-4">
              {draft.blocks.map((block, index) => {
                if (block.type === "audience") return null;
                return (
                <div key={`${block.id || "new"}-${index}`} className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <div className="grid gap-3 md:grid-cols-[100px_160px_minmax(0,1fr)_80px]">
                    <input type="number" value={block.sortOrder} onChange={(event) => setDraft((current) => ({ ...current, blocks: current.blocks.map((item, itemIndex) => itemIndex === index ? { ...item, sortOrder: Number(event.target.value) } : item) }))} className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none" />
                    <select value={block.type} onChange={(event) => setDraft((current) => ({ ...current, blocks: current.blocks.map((item, itemIndex) => itemIndex === index ? { ...item, type: event.target.value } : item) }))} className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none">
                      {[
                        "intro",
                        "text",
                        "posts",
                        "offers",
                        "cta",
                      ].map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <textarea value={block.content} onChange={(event) => setDraft((current) => ({ ...current, blocks: current.blocks.map((item, itemIndex) => itemIndex === index ? { ...item, content: event.target.value } : item) }))} className="h-28 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none" />
                    <button type="button" onClick={() => setDraft((current) => ({ ...current, blocks: current.blocks.filter((_, itemIndex) => itemIndex !== index) }))} className="rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:border-red-400">Quitar</button>
                  </div>
                </div>
                );
              })}
              <button type="button" onClick={() => setDraft((current) => ({ ...current, blocks: [...current.blocks, { sortOrder: current.blocks.length + 1, type: "text", content: "" }] }))} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 hover:border-primary-500 hover:text-primary-300">Anadir bloque</button>
            </div>
            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={saveCampaign} disabled={busy} className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-500 disabled:opacity-60">{busy ? "Guardando..." : draft.id ? "Guardar cambios" : "Crear campana"}</button>
              <input value={testEmail} onChange={(event) => setTestEmail(event.target.value)} placeholder="email de prueba" className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none" />
              <button type="button" onClick={sendTest} disabled={busy} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-200 hover:border-white/20 disabled:opacity-60">Enviar prueba</button>
              <button type="button" onClick={sendNow} disabled={busy} className="rounded-2xl border border-emerald-500/30 px-5 py-3 text-sm font-semibold text-emerald-300 hover:border-emerald-400 disabled:opacity-60">Enviar ahora</button>
            </div>
          </article>

          <section className="grid gap-6 xl:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
              <h3 className="text-lg font-semibold text-white">Ultimos jobs</h3>
              <div className="mt-4 space-y-3">
                {jobs.slice(0, 8).map((job) => (
                  <div key={job.id} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                    <p className="font-semibold text-zinc-100">{job.campaign.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{job.status} · {formatDate(job.runAt)}</p>
                    {job.error && <p className="mt-2 text-xs text-red-300">{job.error}</p>}
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
              <h3 className="text-lg font-semibold text-white">Eventos</h3>
              <div className="mt-4 space-y-3">
                {events.slice(0, 8).map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                    <p className="font-semibold text-zinc-100">{event.subscriber.email}</p>
                    <p className="mt-1 text-xs text-zinc-500">{event.eventType} · {event.sendJob.campaign.name}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
              <h3 className="text-lg font-semibold text-white">Email logs</h3>
              <div className="mt-4 space-y-3">
                {logs.slice(0, 8).map((log) => (
                  <div key={log.id} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                    <p className="font-semibold text-zinc-100">{log.destination}</p>
                    <p className="mt-1 text-xs text-zinc-500">{log.status} · {formatDate(log.createdAt)}</p>
                    {log.error && <p className="mt-2 text-xs text-red-300">{log.error}</p>}
                  </div>
                ))}
              </div>
            </article>
          </section>

          {selectedCampaign && (
            <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
              <h3 className="text-lg font-semibold text-white">Resumen de campana seleccionada</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Estado</p><p className="mt-2 text-lg font-bold text-white">{selectedCampaign.status}</p></div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Programada</p><p className="mt-2 text-lg font-bold text-white">{formatDate(selectedCampaign.scheduledFor)}</p></div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Enviada</p><p className="mt-2 text-lg font-bold text-white">{formatDate(selectedCampaign.sentAt)}</p></div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Bloques</p><p className="mt-2 text-lg font-bold text-white">{selectedCampaign.blocks.length}</p></div>
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
