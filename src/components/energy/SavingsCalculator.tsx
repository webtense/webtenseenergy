"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateSavings } from "@/lib/energy-calculator";
import type { CalculadoraInputs, PerfilConsumo, TarifaMode } from "@/types/energy";
import { withBasePath } from "@/lib/paths";

const DEFAULT_INPUTS: CalculadoraInputs = {
  consumo: 250,
  potencia: 5.75,
  precio: 0.18,
  tarifa: "regulada",
  perfil: "normal",
  solar: false,
  solarKw: 3,
};

const tarifaOptions: { label: string; value: TarifaMode }[] = [
  { label: "PVPC", value: "regulada" },
  { label: "Libre", value: "libre" },
  { label: "Plana", value: "plana" },
];

const perfilOptions: { label: string; value: PerfilConsumo }[] = [
  { label: "Estándar", value: "normal" },
  { label: "Diurno", value: "diurno" },
  { label: "Nocturno", value: "nocturno" },
  { label: "Fin de semana", value: "fin" },
];

const money = (value: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

type Props = { basePath?: string };

export function SavingsCalculator({ basePath = "" }: Props) {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const result = useMemo(() => calculateSavings(inputs), [inputs]);

  const update = <K extends keyof CalculadoraInputs>(key: K, value: CalculadoraInputs[K]) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="surface-panel grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8">
      <div>
        <p className="eyebrow">Herramienta rápida</p>
        <h3 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground">Calcula tu ahorro potencial</h3>
        <p className="mt-3 text-sm leading-7 text-foreground/70">
          Ajusta consumo, potencia y perfil de uso. Obtendrás una estimación orientativa y la mejor siguiente acción para estudiar tu factura.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">Tarifa actual</p>
            <div className="flex flex-wrap gap-2">
              {tarifaOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update("tarifa", option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    inputs.tarifa === option.value
                      ? "bg-primary-600 text-white"
                      : "border border-zinc-200 bg-white text-foreground/70 hover:border-primary-300 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <RangeField label="Consumo mensual" value={inputs.consumo} display={`${inputs.consumo} kWh`} min={50} max={800} step={10} onChange={(value) => update("consumo", value)} />
          <RangeField label="Potencia contratada" value={inputs.potencia} display={`${inputs.potencia.toFixed(2)} kW`} min={2.3} max={15} step={0.05} onChange={(value) => update("potencia", value)} />
          <RangeField label="Precio energía" value={inputs.precio} display={`${inputs.precio.toFixed(2)} €/kWh`} min={0.08} max={0.35} step={0.01} onChange={(value) => update("precio", value)} />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">Perfil</p>
            <div className="grid grid-cols-2 gap-2">
              {perfilOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update("perfil", option.value)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    inputs.perfil === option.value
                      ? "bg-foreground text-background"
                      : "border border-zinc-200 bg-white text-foreground/70 hover:border-primary-300 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="surface-panel-soft p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Autoconsumo solar</p>
                <p className="text-xs text-foreground/60">Actívalo si ya tienes o estás valorando placas.</p>
              </div>
              <button
                type="button"
                onClick={() => update("solar", !inputs.solar)}
                className={`h-8 w-14 rounded-full p-1 transition ${inputs.solar ? "bg-primary-600" : "bg-zinc-200 dark:bg-white/10"}`}
              >
                <span className={`block h-6 w-6 rounded-full bg-white transition ${inputs.solar ? "translate-x-6" : "translate-x-0"}`}></span>
              </button>
            </div>
            {inputs.solar ? (
              <div className="mt-4">
                <RangeField label="Potencia solar" value={inputs.solarKw} display={`${inputs.solarKw.toFixed(1)} kWp`} min={1} max={10} step={0.5} onChange={(value) => update("solarKw", value)} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="surface-panel-soft p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">Estimación</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultCard label="Factura actual" value={money(result.facturaActual)} />
            <ResultCard label="Factura optimizada" value={money(result.facturaOptimizada)} highlight />
            <ResultCard label="Ahorro / mes" value={money(result.ahorroMes)} highlight />
            <ResultCard label="Ahorro / año" value={money(result.ahorroAno)} highlight />
          </div>
        </div>

        <div className="surface-panel-soft p-5">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>Término fijo</span>
            <span>{result.pctPotencia}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${result.pctPotencia}%` }}></div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-foreground/60">
            <span>Energía consumida</span>
            <span>{result.pctEnergia}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${result.pctEnergia}%` }}></div>
          </div>
        </div>

        <div className="space-y-3">
          {result.tips.map((tip) => (
            <div key={tip} className="rounded-2xl border border-primary-200 bg-primary-50/80 px-4 py-3 text-sm leading-6 text-primary-900 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-100">
              {tip}
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <Link href={withBasePath(basePath, "/estudio")} className="cta-primary w-full">
            Solicitar análisis gratuito
          </Link>
          <Link href={withBasePath(basePath, "/luz/precio-hoy")} className="cta-secondary w-full">
            Ver precio de la luz
          </Link>
        </div>
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <label className="font-medium text-foreground/70">{label}</label>
        <span className="font-semibold text-foreground">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[var(--color-primary-600)]" />
    </div>
  );
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">{label}</p>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${highlight ? "text-primary-600 dark:text-primary-300" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
