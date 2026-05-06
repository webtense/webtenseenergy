'use client';

import React, { useState, useEffect } from 'react';
import { SectionHero } from '@/components/shared/SectionHero';

export function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorError, setError] = useState('');
  const [loadedAt, setLoadedAt] = useState('');
  useEffect(() => {
    setLoadedAt(Date.now().toString());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al enviar. Inténtalo de nuevo.');
      }
    } catch {
      setError('Error de red. Asegúrate de tener conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SectionHero
        eyebrow="Contacto directo"
        title={
          <>
            Cuéntanos tu caso y te orientamos{' '}
            <span className="text-primary-600 dark:text-primary-300">sin rodeos</span>
          </>
        }
        subtitle="Selecciona la opción que mejor describe tu situación para que podamos orientarte mejor."
        align="center"
        compact
      />

      <section className="section-shell-tight pt-0 pb-0">
        <div className="section-inner">
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            <a
              href="/estudio"
              className="group surface-panel-soft p-7 flex flex-col gap-3 transition hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-500/20"
            >
              <span className="text-2xl">▣</span>
              <p className="font-heading text-lg font-bold tracking-tight text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                Soy empresa y pago más de 3.000 €/mes
              </p>
              <p className="text-sm text-foreground/60 leading-6">
                Solicita el análisis energético gratuito. Te respondemos en 48 horas con cifras reales.
              </p>
              <span className="mt-auto text-sm font-semibold text-primary-600 dark:text-primary-400">
                Solicitar estudio →
              </span>
            </a>
            <a
              href="/particulares"
              className="group surface-panel-soft p-7 flex flex-col gap-3 transition hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-white/20"
            >
              <span className="text-2xl">◫</span>
              <p className="font-heading text-lg font-bold tracking-tight text-foreground group-hover:text-foreground/80 transition-colors">
                Soy particular
              </p>
              <p className="text-sm text-foreground/60 leading-6">
                Guías, comparativas de tarifas, domótica y recursos para ahorrar en tu hogar.
              </p>
              <span className="mt-auto text-sm font-semibold text-foreground/50">
                Ver recursos →
              </span>
            </a>
          </div>
          <p className="text-center text-xs text-foreground/35 mt-6">
            O rellena el formulario de abajo si tienes una consulta específica.
          </p>
        </div>
      </section>

      <section className="section-shell-tight pb-24">
        <div className="section-inner grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="surface-panel-soft p-7">
              <p className="eyebrow">Canales</p>
              <div className="mt-5 space-y-5 text-sm">
                <div>
                  <p className="font-semibold text-foreground">WhatsApp / Teléfono</p>
                  <a
                    href="https://wa.me/34691521367"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-foreground/70 hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    +34 691 521 367
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <a
                    href="mailto:info@webtenseenergy.com"
                    className="mt-2 block text-foreground/70 hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    info@webtenseenergy.com
                  </a>
                </div>
              </div>
            </div>
            <div className="surface-panel-soft p-7">
              <p className="font-semibold text-foreground">Respuesta orientativa</p>
              <p className="mt-3 text-sm leading-7 text-foreground/70">
                Respondemos en un plazo máximo de 24 horas laborables y, si tu caso encaja mejor con
                un estudio, te indicaremos el camino más rápido.
              </p>
            </div>
          </div>

          <div className="surface-panel p-7 md:p-8">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Envíanos un mensaje
            </h2>
            {isSuccess ? (
              <div className="mt-6 rounded-[1.6rem] border border-primary-200 bg-primary-50 p-8 text-center dark:border-primary-500/20 dark:bg-primary-500/10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
                  ✓
                </div>
                <h3 className="mt-5 text-2xl font-bold text-foreground">Mensaje enviado</h3>
                <p className="mt-2 text-sm leading-7 text-foreground/70">
                  Hemos recibido tu consulta correctamente. Te contestaremos pronto.
                </p>
                <button onClick={() => setIsSuccess(false)} className="cta-secondary mt-6">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* honeypot — no tocar */}
                <input
                  name="website"
                  type="text"
                  style={{ position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <input name="_t" type="hidden" value={loadedAt} readOnly />
                {errorError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {errorError}
                  </div>
                ) : null}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Nombre completo"
                    name="name"
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                  <Field label="Teléfono" name="phone" placeholder="Ej. +34 600 000 000" />
                </div>
                <Field
                  label="Correo electrónico"
                  name="email"
                  placeholder="tu@email.com"
                  required
                  type="email"
                />
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-foreground/75"
                  >
                    Asunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-foreground dark:border-white/10 dark:bg-white/5"
                  >
                    <option value="Información general">Información general</option>
                    <option value="Consultoría B2B">Consultoría B2B</option>
                    <option value="Ahorro Particulares">Ahorro Particulares / Solar</option>
                    <option value="Domótica">Proyectos de Domótica</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-foreground/75"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-foreground dark:border-white/10 dark:bg-white/5"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-primary w-full disabled:opacity-60"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = 'text',
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-foreground/75">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-foreground dark:border-white/10 dark:bg-white/5"
      />
    </div>
  );
}
