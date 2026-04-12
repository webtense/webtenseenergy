"use client";

import { useEffect, useMemo, useState } from "react";
import { getElectricityPrices, type ElectricityData } from "@/lib/electricity-api";

export default function ElectricityDashboard() {
  const [data, setData] = useState<ElectricityData | null>(null);
  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getElectricityPrices();
        setData(result);
      } catch (error) {
        console.error("Error fetching electricity prices:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const taxMultiplier = includeTaxes ? 1.25 : 1;
  const formatPrice = (value: number) => `${(value * taxMultiplier).toFixed(5)} €/kWh`;

  const derived = useMemo(() => {
    if (!data) return null;
    const sorted = [...data.hourly].sort((a, b) => a.price - b.price);
    const cheapest = sorted.slice(0, 3);
    const expensive = sorted.slice(-3).reverse();
    const now = data.now;
    const status = now <= data.average * 0.9 ? "Buen momento para consumir" : now >= data.average * 1.15 ? "Conviene posponer cargas" : "Precio intermedio";
    return { cheapest, expensive, status };
  }, [data]);

  if (loading || !data || !derived) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl text-foreground">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Datos del día</p>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight">{data.date}</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/65">Fuente: {data.source || "mercado regulado"}. Actualizado: {data.updatedAt ? new Date(data.updatedAt).toLocaleString("es-ES") : "ahora"}.</p>
        </div>

        <label className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/5">
          <span className="text-foreground/65">Incluir impuestos</span>
          <button
            type="button"
            onClick={() => setIncludeTaxes((value) => !value)}
            className={`h-8 w-14 rounded-full p-1 transition ${includeTaxes ? "bg-primary-600" : "bg-zinc-200 dark:bg-white/10"}`}
          >
            <span className={`block h-6 w-6 rounded-full bg-white transition ${includeTaxes ? "translate-x-6" : "translate-x-0"}`}></span>
          </button>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Precio ahora" value={formatPrice(data.now)} detail={derived.status} highlight />
        <MetricCard label="Media diaria" value={formatPrice(data.average)} detail="Referencia del día" />
        <MetricCard label="Mejor tramo" value={formatPrice(data.min.price)} detail={data.min.time} positive />
        <MetricCard label="Peor tramo" value={formatPrice(data.max.price)} detail={data.max.time} negative />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-panel-soft p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-2xl font-bold tracking-tight">Lectura horaria</h3>
              <p className="mt-2 text-sm text-foreground/60">Barras relativas para localizar de un vistazo los mejores y peores momentos del día.</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.hourly.map((entry) => {
              const ratio = data.max.price > 0 ? Math.max(10, Math.round((entry.price / data.max.price) * 100)) : 0;
              const isMin = entry.price === data.min.price;
              const isMax = entry.price === data.max.price;
              return (
                <div key={entry.hour} className="grid grid-cols-[6.8rem_1fr_6.5rem] items-center gap-3 text-sm">
                  <span className="font-medium text-foreground/60">{entry.hour}</span>
                  <div className="h-3 rounded-full bg-zinc-200 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full ${isMin ? "bg-primary-500" : isMax ? "bg-red-500" : "bg-brand-500/85"}`}
                      style={{ width: `${ratio}%` }}
                    ></div>
                  </div>
                  <span className={`text-right font-semibold ${isMin ? "text-primary-700 dark:text-primary-300" : isMax ? "text-red-700 dark:text-red-300" : "text-foreground/75"}`}>
                    {formatPrice(entry.price)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel-soft p-6">
            <h3 className="font-heading text-2xl font-bold tracking-tight">Ventanas recomendadas</h3>
            <div className="mt-5 space-y-3">
              {derived.cheapest.map((entry) => (
                <div key={entry.hour} className="rounded-2xl border border-primary-200 bg-primary-50/80 px-4 py-3 dark:border-primary-500/20 dark:bg-primary-500/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700 dark:text-primary-300">Buen momento</p>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-foreground">{entry.hour}</span>
                    <span className="text-sm font-bold text-primary-700 dark:text-primary-300">{formatPrice(entry.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel-soft p-6">
            <h3 className="font-heading text-2xl font-bold tracking-tight">Tramos a evitar</h3>
            <div className="mt-5 space-y-3">
              {derived.expensive.map((entry) => (
                <div key={entry.hour} className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700 dark:text-red-300">Pico del día</p>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-foreground">{entry.hour}</span>
                    <span className="text-sm font-bold text-red-700 dark:text-red-300">{formatPrice(entry.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail, highlight = false, positive = false, negative = false }: { label: string; value: string; detail: string; highlight?: boolean; positive?: boolean; negative?: boolean }) {
  return (
    <div className="surface-panel-soft p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/45">{label}</p>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${highlight ? "text-primary-700 dark:text-primary-300" : positive ? "text-primary-700 dark:text-primary-300" : negative ? "text-red-700 dark:text-red-300" : "text-foreground"}`}>{value}</p>
      <p className="mt-2 text-sm text-foreground/55">{detail}</p>
    </div>
  );
}
