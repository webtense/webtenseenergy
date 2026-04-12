"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SectionHero } from "@/components/shared/SectionHero";

type OfertaCategoria = "Todos" | "Solar" | "Domótica" | "Medición" | "Climatización";
type OfertaSort = "descuento" | "precio";

type Oferta = {
  title: string;
  price: number;
  oldPrice: number;
  categoria: Exclude<OfertaCategoria, "Todos">;
  url: string;
  icon: string;
  rating: number;
  tag?: string;
};

const OFERTAS: Oferta[] = [
  { title: "Kit Paneles Solares 400W", price: 199, oldPrice: 299, categoria: "Solar", url: "https://www.amazon.es/s?k=kit+panel+solar+400w&tag=semillasdet02-21", icon: "☀️", rating: 4.6, tag: "Mejor ahorro" },
  { title: "Termostato Inteligente WiFi", price: 45.5, oldPrice: 89.99, categoria: "Climatización", url: "https://www.amazon.es/s?k=termostato+inteligente+wifi&tag=semillasdet02-21", icon: "🌡️", rating: 4.5, tag: "Top invierno" },
  { title: "Pack 4 Enchufes Inteligentes", price: 24.99, oldPrice: 34.99, categoria: "Domótica", url: "https://www.amazon.es/s?k=enchufe+inteligente+wifi&tag=semillasdet02-21", icon: "🔌", rating: 4.4 },
  { title: "Medidor Consumo Eléctrico Carril DIN", price: 32.15, oldPrice: 45, categoria: "Medición", url: "https://www.amazon.es/s?k=medidor+consumo+electrico+carril+din&tag=semillasdet02-21", icon: "📊", rating: 4.3, tag: "Control" },
];

export function OfertasPage() {
  const [ofertasEnabled, setOfertasEnabled] = useState(true);
  const [categoria, setCategoria] = useState<OfertaCategoria>("Todos");
  const [sort, setSort] = useState<OfertaSort>("descuento");

  const filtered = useMemo(() => {
    const selected = categoria === "Todos" ? OFERTAS : OFERTAS.filter((offer) => offer.categoria === categoria);
    return [...selected].sort((a, b) => {
      if (sort === "precio") return a.price - b.price;
      const aDiscount = a.oldPrice - a.price;
      const bDiscount = b.oldPrice - b.price;
      return bDiscount - aDiscount;
    });
  }, [categoria, sort]);

  const categories: OfertaCategoria[] = ["Todos", "Solar", "Domótica", "Medición", "Climatización"];

  useEffect(() => {
    fetch("/api/public/feature-flags")
      .then((res) => res.json())
      .then((data) => setOfertasEnabled(data.ofertas !== false))
      .catch(() => {});
  }, []);

  if (!ofertasEnabled) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Sección en mantenimiento</h1>
          <p className="text-foreground/60">Vuelve pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <SectionHero
        eyebrow="Selección curada"
        title={<>Ofertas que sí encajan con un hogar <span className="text-brand-600 dark:text-brand-300">más eficiente</span></>}
        subtitle="No buscamos parecer un marketplace. Filtramos productos de energía, control y domótica para que encuentres referencias útiles sin perder tiempo." 
        align="center"
        compact
        actions={
          <Link href="https://t.me/webtenseenergy" target="_blank" rel="noopener noreferrer" className="cta-primary">
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
                    ? "bg-primary-600 text-white"
                    : "border border-zinc-200 bg-white text-foreground/65 hover:border-primary-300 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-foreground/55">Ordenar por</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as OfertaSort)} className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-semibold text-foreground dark:border-white/10 dark:bg-white/5">
              <option value="descuento">Mayor ahorro</option>
              <option value="precio">Menor precio</option>
            </select>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((oferta) => {
            const discount = Math.round(((oferta.oldPrice - oferta.price) / oferta.oldPrice) * 100);
            return (
              <div key={oferta.title} className="surface-panel-soft flex flex-col overflow-hidden p-5 transition hover:-translate-y-1 hover:border-brand-300 dark:hover:border-brand-500/20">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700 dark:bg-red-500/10 dark:text-red-300">-{discount}%</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/65 dark:bg-white/10 dark:text-zinc-300">{oferta.categoria}</span>
                  {oferta.tag ? <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">{oferta.tag}</span> : null}
                </div>
                <div className="mt-5 flex h-40 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top_left,rgba(26,183,117,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(59,118,246,0.16),transparent_34%)] text-6xl">
                  {oferta.icon}
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">{oferta.title}</h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                  <span>{"★".repeat(Math.floor(oferta.rating))}</span>
                  <span className="text-foreground/50">{oferta.rating.toFixed(1)}</span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-foreground/40 line-through">{oferta.oldPrice.toFixed(2)} €</p>
                    <p className="text-3xl font-bold tracking-tight text-brand-600 dark:text-brand-300">{oferta.price.toFixed(2)} €</p>
                  </div>
                </div>
                <a href={oferta.url} target="_blank" rel="noopener noreferrer" className="cta-primary mt-6 w-full">
                  Ver producto
                </a>
              </div>
            );
          })}
        </div>
        <div className="section-inner mt-10">
          <p className="text-center text-xs leading-6 text-foreground/50">
            Selección editorial con enlaces de afiliación. Priorizamos productos útiles para control, ahorro y domótica aplicada, no volumen sin criterio.
          </p>
        </div>
      </section>
    </div>
  );
}
