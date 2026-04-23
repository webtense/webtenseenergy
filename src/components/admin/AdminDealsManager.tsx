'use client';

import { useState } from 'react';

type Deal = {
  id: string;
  title: string;
  message: string;
  url: string | null;
  status: string;
  sentAt: string | null;
  updatedAt: string;
};

type Props = {
  initialDeals: Deal[];
};

export function AdminDealsManager({ initialDeals }: Props) {
  const [rawText, setRawText] = useState('');
  const [deals, setDeals] = useState(initialDeals);
  const [selectedId, setSelectedId] = useState<string | null>(initialDeals[0]?.id || null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const selected = deals.find((deal) => deal.id === selectedId) || null;

  const reload = async () => {
    const response = await fetch('/api/admin/telegram/deals');
    if (!response.ok) return;
    const payload = (await response.json()) as { deals: Deal[] };
    setDeals(payload.deals);
    setSelectedId((current) => current || payload.deals[0]?.id || null);
  };

  const ingest = async () => {
    if (!rawText.trim()) {
      setStatus('Pega primero el texto de la oferta.');
      return;
    }

    setBusy(true);
    setStatus('');

    try {
      const response = await fetch('/api/admin/telegram/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      const payload = (await response.json()) as {
        message?: string;
        deal?: Deal;
        postSlug?: string;
      };
      if (!response.ok || !payload.deal) {
        throw new Error(payload.message || 'No se pudo crear el borrador.');
      }

      setDeals((prev) => [payload.deal!, ...prev]);
      setSelectedId(payload.deal.id);
      setRawText('');
      setStatus(
        payload.postSlug
          ? `Borrador creado. Post asociado: /blog/${payload.postSlug}`
          : 'Borrador creado.'
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo crear el borrador.');
    } finally {
      setBusy(false);
    }
  };

  const saveSelected = async () => {
    if (!selected) return;
    setBusy(true);
    setStatus('');

    try {
      const response = await fetch(`/api/admin/telegram/deals/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selected.title,
          message: selected.message,
          url: selected.url,
          status: selected.status,
        }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || 'No se pudo guardar.');
      }
      setStatus('Borrador guardado.');
      await reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo guardar.');
    } finally {
      setBusy(false);
    }
  };

  const publishSelected = async () => {
    if (!selected) return;
    setBusy(true);
    setStatus('');

    try {
      const response = await fetch(`/api/admin/telegram/deals/${selected.id}/publish`, {
        method: 'POST',
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || 'No se pudo publicar en Telegram.');
      }
      setStatus('Publicado en Telegram.');
      await reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo publicar.');
    } finally {
      setBusy(false);
    }
  };

  const updateSelected = (patch: Partial<Deal>) => {
    setDeals((prev) => prev.map((deal) => (deal.id === selectedId ? { ...deal, ...patch } : deal)));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div>
          <h3 className="text-lg font-semibold">Nueva oferta</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Pega el bloque del canal y se generará el borrador de Telegram y un post en revisión.
          </p>
        </div>
        <textarea
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder="Pega aquí el texto completo de la oferta..."
          className="min-h-52 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={ingest}
          disabled={busy}
          className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-500 disabled:opacity-60"
        >
          {busy ? 'Procesando...' : 'Crear borrador'}
        </button>

        <div className="space-y-3 border-t border-white/10 pt-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Borradores recientes
          </h4>
          <div className="space-y-2">
            {deals.map((deal) => (
              <button
                key={deal.id}
                type="button"
                onClick={() => setSelectedId(deal.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedId === deal.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/10 bg-zinc-900 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-100">{deal.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {deal.status}
                      {deal.sentAt
                        ? ` · enviado ${new Date(deal.sentAt).toLocaleString('es-ES')}`
                        : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {deals.length === 0 && (
              <p className="text-sm text-zinc-500">Todavía no hay borradores.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
        {selected ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Revisión manual</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Ajusta el mensaje antes de guardarlo o publicarlo. El post queda en revisión dentro
                del gestor de blog.
              </p>
            </div>
            <input
              value={selected.title}
              onChange={(event) => updateSelected({ title: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
            />
            <input
              value={selected.url || ''}
              onChange={(event) => updateSelected({ url: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
            />
            <textarea
              value={selected.message}
              onChange={(event) => updateSelected({ message: event.target.value })}
              className="min-h-72 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={saveSelected}
                disabled={busy}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-zinc-200 hover:border-primary-500 disabled:opacity-60"
              >
                Guardar borrador
              </button>
              <button
                type="button"
                onClick={publishSelected}
                disabled={busy}
                className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-500 disabled:opacity-60"
              >
                Aprobar y publicar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-72 items-center justify-center text-center text-sm text-zinc-500">
            Selecciona un borrador para revisarlo.
          </div>
        )}
        {status && (
          <p className="mt-4 rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm">
            {status}
          </p>
        )}
      </section>
    </div>
  );
}
