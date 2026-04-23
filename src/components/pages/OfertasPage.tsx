'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SectionHero } from '@/components/shared/SectionHero';
import type { OfferCatalogItem } from '@/lib/offers-cache';

type OfertaCategoria = 'Todos' | 'Solar' | 'Domótica' | 'Medición' | 'Climatización';
type OfertaSort = 'descuento' | 'precio' | 'valoracion';

type Props = {
  initialOffers: OfferCatalogItem[];
  refreshedAt: string;
  source: 'cache' | 'database' | 'fallback';
};

export function OfertasPage({ initialOffers, refreshedAt, source }: Props) {
  const [categoria, setCategoria] = useState<OfertaCategoria>('Todos');
  const [sort, setSort] = useState<OfertaSort>('descuento');

  const filtered = useMemo(() => {
    const selected =
      categoria === 'Todos'
        ? initialOffers
        : initialOffers.filter((offer) => offer.category === categoria);
    return [...selected].sort((a, b) => {
      if (sort === 'precio') return a.price - b.price;
      if (sort === 'valoracion') return b.rating - a.rating;
      const aDiscount = a.oldPrice - a.price;
      const bDiscount = b.oldPrice - b.price;
      return bDiscount - aDiscount;
    });
  }, [categoria, initialOffers, sort]);

  const categories: OfertaCategoria[] = ['Todos', 'Solar', 'Domótica', 'Medición', 'Climatización'];
  const refreshedLabel = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(refreshedAt));

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <SectionHero
        eyebrow="Selección curada"
        title={
          <>
            Ofertas que sí encajan con un hogar{' '}
            <span className="text-brand-600 dark:text-brand-300">más eficiente</span>
          </>
        }
        subtitle="Filtramos productos de energía, control y domótica para que encuentres referencias útiles sin perder tiempo."
        align="center"
        compact
        actions={
          <Link
            href="https://t.me/webtenseenergy"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Unirme al canal de Telegram
          </Link>
        }
      />

      <section className="section-shell-tight border-b border-zinc-200/80 bg-zinc-50/80 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="section-inner flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategoria(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  categoria === item
                    ? 'bg-primary-600 text-white'
                    : 'border border-zinc-200 bg-white text-foreground/65 hover:border-primary-300 dark:border-white/10 dark:bg-white/5'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
            <span className="text-foreground/55">Actualizado: {refreshedLabel}</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as OfertaSort)}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-semibold text-foreground dark:border-white/10 dark:bg-white/5"
            >
              <option value="descuento">Mayor ahorro</option>
              <option value="precio">Menor precio</option>
              <option value="valoracion">Mejor valorado</option>
            </select>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((offer) => {
            const discount =
              offer.oldPrice > offer.price
                ? Math.round(((offer.oldPrice - offer.price) / offer.oldPrice) * 100)
                : 0;
            return (
              <div
                key={offer.id}
                className="surface-panel-soft flex flex-col overflow-hidden p-5 transition hover:-translate-y-1 hover:border-brand-300 dark:hover:border-brand-500/20"
              >
                <div className="flex flex-wrap gap-2">
                  {discount > 0 ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700 dark:bg-red-500/10 dark:text-red-300">
                      -{discount}%
                    </span>
                  ) : null}
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/65 dark:bg-white/10 dark:text-zinc-300">
                    {offer.category}
                  </span>
                  {offer.tag ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                      {offer.tag}
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 flex h-40 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top_left,rgba(26,183,117,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(59,118,246,0.16),transparent_34%)] text-6xl">
                  {offer.icon}
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">
                  {offer.title}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                  <span>{'★'.repeat(Math.max(1, Math.floor(offer.rating)))}</span>
                  <span className="text-foreground/50">{offer.rating.toFixed(1)}</span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    {offer.oldPrice > offer.price ? (
                      <p className="text-sm text-foreground/40 line-through">
                        {offer.oldPrice.toFixed(2)} €
                      </p>
                    ) : null}
                    <p className="text-3xl font-bold tracking-tight text-brand-600 dark:text-brand-300">
                      {offer.price.toFixed(2)} €
                    </p>
                  </div>
                </div>
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary mt-6 w-full"
                >
                  Ver producto
                </a>
              </div>
            );
          })}
        </div>
        <div className="section-inner mt-10 space-y-3 text-center text-xs leading-6 text-foreground/50">
          <p>
            Fuente de catálogo:{' '}
            {source === 'database'
              ? 'ofertas gestionadas en backoffice'
              : source === 'cache'
                ? 'caché local regenerable'
                : 'fallback editorial'}
            .
          </p>
          <p>
            Selección editorial con enlaces de afiliación. Priorizamos productos útiles para
            control, ahorro y domótica aplicada.
          </p>
        </div>
      </section>
    </div>
  );
}
