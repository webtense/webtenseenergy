import Link from 'next/link';
import B2BLeadForm from '@/components/ui/B2BLeadForm';

const caseMetrics = [
  { value: '18.400 €', label: 'Factura antes', accent: false },
  { value: '11.200 €', label: 'Factura después', accent: true },
  { value: '86.400 €', label: 'Ahorro anual', accent: true },
  { value: '4,2 meses', label: 'Retorno inversión', accent: false },
];

export function EstudioPage() {
  return (
    <div className="bg-background">
      {/* ───── LAYOUT SPLIT ─────────────────────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[420px_1fr]">
        {/* ── PANEL IZQUIERDO: Prueba social (dark) ─────────────────── */}
        <aside className="bg-[#06111d] px-8 py-14 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:overflow-y-auto lg:px-10 lg:py-16">
          {/* Cabecera panel */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-400">
              Análisis gratuito · 48h · Sin compromiso
            </p>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
              Envíanos tus facturas. En 48h sabes cuánto puedes ahorrar.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Solo trabajamos con empresas cuya factura supera los 3.000 €/mes. Si es tu caso, el
              análisis es gratuito y el informe tiene cifras reales, no estimaciones genéricas.
            </p>

            {/* Case study strip */}
            <div className="mt-10 rounded-2xl border border-white/10 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-400">
                Caso real — Hotel 4★ · Costa Brava
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {caseMetrics.map((m) => (
                  <div key={m.label}>
                    <p
                      className={`font-heading text-2xl font-bold tracking-tight ${m.accent ? 'text-primary-400' : 'text-white/50 line-through decoration-white/30'}`}
                    >
                      {m.value}
                    </p>
                    <p className="mt-0.5 text-xs text-white/40">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/50 italic">
                "Lo que más me sorprendió no fue el ahorro. Fue ver por primera vez exactamente
                dónde se iba el dinero."
              </p>
              <p className="mt-1 text-xs font-semibold text-white/40">
                Director de operaciones · Hotel 4★
              </p>
            </div>

            {/* Lo que incluye */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/30">
                El análisis incluye
              </p>
              <ul className="space-y-3">
                {[
                  'Revisión de potencias contratadas y penalizaciones activas',
                  'Detección de consumo en horas de precio máximo',
                  'Estimación de ahorro anual con plan priorizado',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer del panel */}
          <div className="mt-10 border-t border-white/10 pt-6">
            <Link
              href="/caso-real"
              className="text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Ver el caso completo →
            </Link>
            <p className="mt-3 text-xs text-white/30">
              Datos validados por el cliente. Nombre no publicado por confidencialidad.
            </p>
          </div>
        </aside>

        {/* ── PANEL DERECHO: Formulario ──────────────────────────────── */}
        <main className="px-6 py-12 lg:px-16 lg:py-16">
          {/* Cabecera formulario */}
          <div className="mb-10 max-w-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Solicitar análisis
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Rellena el formulario. Es rápido.
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/60">
              Dos pasos: adjunta una factura y déjanos tu contacto. El análisis no compromete nada
              ni tiene coste.
            </p>
          </div>

          {/* Métricas de confianza rápidas */}
          <div className="mb-10 flex flex-wrap gap-4">
            {[
              { v: '48h', l: 'Respuesta en' },
              { v: '22–38%', l: 'Ahorro medio' },
              { v: '0 €', l: 'Coste del análisis' },
            ].map((m) => (
              <div
                key={m.l}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {m.v}
                </span>
                <span className="text-xs text-foreground/50">{m.l}</span>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <div className="max-w-lg">
            <B2BLeadForm />
          </div>

          {/* Credibilidad inferior */}
          <div className="mt-12 max-w-lg border-t border-zinc-100 pt-8 dark:border-zinc-800">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: '◫',
                  title: 'Sin compromiso',
                  desc: 'El análisis no obliga a contratar nada.',
                },
                {
                  icon: '◧',
                  title: 'Datos privados',
                  desc: 'Tu factura no se comparte con terceros.',
                },
                {
                  icon: '▣',
                  title: 'Criterio independiente',
                  desc: 'No somos distribuidores de ninguna tarifa.',
                },
              ].map((item) => (
                <div key={item.title}>
                  <p className="text-lg text-primary-600 dark:text-primary-400">{item.icon}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-foreground/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
