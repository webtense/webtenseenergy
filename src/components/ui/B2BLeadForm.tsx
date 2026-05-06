'use client';

import React, { useState, useRef, useEffect } from 'react';

type Step = 1 | 2 | 'disqualified' | 'success';

interface LeadData {
  file: File | null;
  monthlyBill: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessType: string;
  city: string;
  preferredTime: string;
}

const BILL_OPTIONS = [
  { value: '3000-6000', label: '3.000 – 6.000 €/mes' },
  { value: '6000-15000', label: '6.000 – 15.000 €/mes' },
  { value: '>15000', label: '+15.000 €/mes' },
  { value: '<3000', label: 'Menos de 3.000 €/mes' },
];

const BUSINESS_TYPES = [
  'Hotel / Alojamiento',
  'Restauración',
  'Industria',
  'Retail / Comercio',
  'Logística',
  'Otro',
];

const PREFERRED_TIMES = ['Mañana (9–13 h)', 'Tarde (13–18 h)', 'Indiferente'];

const INITIAL: LeadData = {
  file: null,
  monthlyBill: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  businessType: '',
  city: '',
  preferredTime: '',
};

export default function B2BLeadForm() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<LeadData>(INITIAL);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedAt, setLoadedAt] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoadedAt(Date.now().toString());
  }, []);

  const handleFile = (f: File) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(f.type)) return;
    if (f.size > 5 * 1024 * 1024) return;
    setData((prev) => ({ ...prev, file: f }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleStep1Next = () => {
    if (data.monthlyBill === '<3000') {
      setStep('disqualified');
    } else {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.set('method', data.file ? 'upload' : 'manual');
      body.set('name', data.name);
      body.set('email', data.email);
      body.set('phone', data.phone);
      body.set('company', data.company);
      body.set('kwConsumed', data.monthlyBill);
      body.set('businessType', data.businessType);
      body.set('city', data.city);
      body.set('preferredTime', data.preferredTime);
      body.set('habits', '[]');
      body.set('website', honeypot);
      body.set('_t', loadedAt);
      if (data.file) body.set('invoice', data.file, data.file.name);

      const res = await fetch('/api/estudio', { method: 'POST', body });
      if (!res.ok) throw new Error();
      setStep('success');
    } catch {
      alert('Error al enviar. Por favor, inténtalo de nuevo o escríbenos por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── PASO 1: Factura + rango mensual ──────────────────────── */}
      {step === 1 && (
        <div>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Paso 1 de 2
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
              Adjunta una factura reciente
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              PDF o imagen. Si no tienes, pasa al siguiente campo directamente.
            </p>
          </div>

          {/* Drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all ${
              dragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                : data.file
                  ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-500/5'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-primary-400'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {data.file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-500/20">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{data.file.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setData((prev) => ({ ...prev, file: null }));
                    }}
                    className="text-xs text-foreground/40 underline hover:text-foreground/70"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <svg
                    className="h-6 w-6 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground/70">
                  Arrastra aquí o{' '}
                  <span className="text-primary-600 dark:text-primary-400">selecciona archivo</span>
                </p>
                <p className="mt-1 text-xs text-foreground/40">PDF, PNG o JPG · máx. 5 MB</p>
              </>
            )}
          </div>

          {/* Factura mensual */}
          <div className="mt-8">
            <label className="text-sm font-semibold text-foreground">
              Factura eléctrica mensual estimada{' '}
              <span className="font-normal text-foreground/50">(obligatorio)</span>
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {BILL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setData((prev) => ({ ...prev, monthlyBill: opt.value }))}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                    data.monthlyBill === opt.value
                      ? opt.value === '<3000'
                        ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500 dark:bg-primary-500/10 dark:text-primary-300'
                      : 'border-zinc-200 text-foreground/70 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {data.monthlyBill === '<3000' && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                Solo analizamos empresas con factura superior a 3.000 €/mes. Aun así puedes
                continuar y te orientamos.
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!data.monthlyBill}
            onClick={handleStep1Next}
            className="mt-8 w-full rounded-xl bg-primary-600 py-4 text-sm font-bold text-white transition-all hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar →
          </button>
        </div>
      )}

      {/* ── PASO 2: Datos de contacto ────────────────────────────── */}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          {/* Honeypot */}
          <input
            name="website"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: 'absolute', left: '-9999px' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Paso 2 de 2
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
              ¿A quién le enviamos el análisis?
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              Sin spam. Solo te contactamos con los resultados del análisis.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground/80">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={data.name}
                onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej. Carlos López"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-foreground transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground/80">
                Empresa *
              </label>
              <input
                type="text"
                required
                value={data.company}
                onChange={(e) => setData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="Hotel, cadena de restauración, industria..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-foreground transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground/80">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@empresa.com"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-foreground transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground/80">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={data.phone}
                  onChange={(e) => setData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="600 000 000"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-foreground transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 mt-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground/80">
                  Tipo de negocio
                </label>
                <select
                  value={data.businessType}
                  onChange={(e) => setData((prev) => ({ ...prev, businessType: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-foreground transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <option value="">Selecciona...</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground/80">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => setData((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Ej. Barcelona"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-foreground transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground/80">
                Horario preferido de contacto
              </label>
              <div className="flex flex-wrap gap-3">
                {PREFERRED_TIMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setData((prev) => ({ ...prev, preferredTime: t }))}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      data.preferredTime === t
                        ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500 dark:bg-primary-500/10 dark:text-primary-300'
                        : 'border-zinc-200 text-foreground/70 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-200 px-5 py-4 text-sm font-bold text-foreground/70 transition-all hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              ← Volver
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 text-sm font-bold text-white transition-all hover:bg-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Enviando...
                </>
              ) : (
                'Solicitar análisis gratuito →'
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-foreground/40">
            Sin compromiso. Te respondemos en 48h laborables.
          </p>
        </form>
      )}

      {/* ── DESQUALIFICADO ──────────────────────────────────────── */}
      {step === 'disqualified' && (
        <div className="py-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <svg
              className="h-8 w-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Nuestro servicio no es para tu caso actual
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-foreground/60">
            Nos especializamos en negocios con factura superior a 3.000 €/mes. Con consumos menores,
            el ahorro potencial no cubre nuestra inversión de tiempo ni la tuya.
          </p>
          <p className="mt-4 text-sm text-foreground/50">
            Si tu negocio crece y supera ese umbral,{' '}
            <button
              type="button"
              onClick={() => {
                setData((prev) => ({ ...prev, monthlyBill: '' }));
                setStep(1);
              }}
              className="text-primary-600 underline dark:text-primary-400"
            >
              vuelve cuando quieras
            </button>
            .
          </p>
        </div>
      )}

      {/* ── ÉXITO ───────────────────────────────────────────────── */}
      {step === 'success' && (
        <div className="py-4">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-500/20">
              <svg
                className="h-7 w-7 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">Solicitud recibida</h2>
              <p className="text-sm text-foreground/60">Nos ponemos a trabajar ahora</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
              Qué pasa a continuación
            </p>
            <ol className="space-y-4">
              {[
                {
                  step: '48h',
                  text: 'Revisamos tu caso y te llamamos con una primera valoración.',
                },
                {
                  step: '5–10 días',
                  text: 'Si hay margen real, recibes el informe completo con cifras concretas.',
                },
                {
                  step: 'Después',
                  text: 'Decides si implementar. Sin presión, sin letra pequeña.',
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="mt-0.5 flex-shrink-0 text-xs font-bold text-primary-600 dark:text-primary-400 w-16">
                    {item.step}
                  </span>
                  <span className="text-sm text-foreground/70">{item.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
