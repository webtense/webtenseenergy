import { db } from '@/lib/db';
import { AdminDealsManager } from '@/components/admin/AdminDealsManager';

export const dynamic = 'force-dynamic';

export default async function AdminOffersPage() {
  const [deals, offers, logs] = await Promise.all([
    db.telegramDeal.findMany({ orderBy: [{ updatedAt: 'desc' }] }),
    db.offer.findMany({ orderBy: [{ updatedAt: 'desc' }], take: 10 }),
    db.telegramLog.findMany({ orderBy: [{ createdAt: 'desc' }], take: 10 }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Canales y ofertas</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Telegram y catalogo comercial</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Pega una oferta, genera el borrador y publicalo tras revision. Debajo tienes visibilidad
            de catalogo y logs.
          </p>
        </div>
        <AdminDealsManager
          initialDeals={deals.map((deal) => ({
            ...deal,
            sentAt: deal.sentAt?.toISOString() || null,
            updatedAt: deal.updatedAt.toISOString(),
          }))}
        />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
          <h3 className="text-xl font-semibold text-white">Ofertas recientes</h3>
          <div className="mt-4 space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3"
              >
                <p className="font-semibold text-zinc-100">{offer.title}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {offer.price}
                  {offer.oldPrice ? ` · antes ${offer.oldPrice}` : ''}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  {offer.category} · {offer.discount || 'sin descuento'}
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
          <h3 className="text-xl font-semibold text-white">Logs de Telegram</h3>
          <div className="mt-4 space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3"
              >
                <p className="font-semibold text-zinc-100">{log.action}</p>
                <p className="mt-1 text-sm text-zinc-400">{log.detail || 'Sin detalle'}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {log.status} ·{' '}
                  {new Intl.DateTimeFormat('es-ES', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(log.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
