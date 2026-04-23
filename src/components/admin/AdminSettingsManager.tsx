'use client';

import { useMemo, useState } from 'react';
import { APP_VERSION } from '@/lib/app-version';

type FeatureFlag = { id: string; key: string; enabled: boolean; description: string | null };
type SiteSetting = { id: string; key: string; value: string; locale: 'ES' | 'CA' | null };

type Props = {
  initialFlags: FeatureFlag[];
  initialSettings: SiteSetting[];
};

export function AdminSettingsManager({ initialFlags, initialSettings }: Props) {
  const [flags, setFlags] = useState(initialFlags);
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const settingValue = useMemo(
    () => (key: string, locale: 'ES' | 'CA') =>
      settings.find((item) => item.key === `${key}:${locale}`)?.value || '',
    [settings]
  );

  const setSettingValue = (key: string, locale: 'ES' | 'CA', value: string) => {
    setSettings((current) => {
      const fullKey = `${key}:${locale}`;
      const exists = current.some((item) => item.key === fullKey);
      if (exists) {
        return current.map((item) => (item.key === fullKey ? { ...item, value } : item));
      }
      return [...current, { id: fullKey, key: fullKey, locale, value }];
    });
  };

  const toggleFlag = async (flag: FeatureFlag) => {
    const nextEnabled = !flag.enabled;
    setFlags((current) =>
      current.map((item) => (item.id === flag.id ? { ...item, enabled: nextEnabled } : item))
    );
    const response = await fetch('/api/admin/feature-flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: flag.key, enabled: nextEnabled, description: flag.description }),
    });
    if (!response.ok) {
      setFlags((current) =>
        current.map((item) => (item.id === flag.id ? { ...item, enabled: flag.enabled } : item))
      );
      setMessage('No se pudo actualizar el flag.');
      return;
    }
    setMessage(`Flag ${flag.key} ${nextEnabled ? 'activado' : 'desactivado'}.`);
  };

  const saveSettings = async () => {
    setBusy(true);
    setMessage('');
    const items = settings.map((item) => ({
      key: item.key.replace(/:(ES|CA)$/, ''),
      locale: item.locale || 'ES',
      value: item.value,
    }));
    const response = await fetch('/api/admin/site-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const payload = (await response.json()) as { settings?: SiteSetting[]; message?: string };
    if (!response.ok || !payload.settings) {
      setMessage(payload.message || 'No se pudieron guardar los ajustes.');
      setBusy(false);
      return;
    }
    setSettings(payload.settings);
    setMessage('Ajustes guardados correctamente.');
    setBusy(false);
  };

  const groups = [
    {
      title: 'Hero home',
      items: [
        { key: 'home.hero.title', label: 'Titulo' },
        { key: 'home.hero.subtitle', label: 'Subtitulo' },
      ],
    },
    {
      title: 'Newsletter publica',
      items: [
        { key: 'newsletter.title', label: 'Titulo' },
        { key: 'newsletter.subtitle', label: 'Subtitulo' },
        { key: 'newsletter.legal', label: 'Texto legal' },
      ],
    },
    {
      title: 'Footer',
      items: [{ key: 'footer.description', label: 'Descripcion corta' }],
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Ajustes</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Flags, copies y version</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Panel central para comportamiento publico del sitio sin tocar codigo.
        </p>
        <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Version canonica</p>
          <p className="mt-2 text-3xl font-bold text-white">{APP_VERSION}</p>
        </div>
        {message && (
          <p className="mt-4 rounded-2xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            {message}
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <h3 className="text-xl font-semibold text-white">Modulos activos</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {flags.map((flag) => (
            <button
              key={flag.id}
              type="button"
              onClick={() => toggleFlag(flag)}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-left hover:border-primary-500"
            >
              <div>
                <p className="font-semibold text-zinc-100">{flag.key}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {flag.description || 'Sin descripcion'}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${flag.enabled ? 'bg-primary-600 text-white' : 'bg-zinc-700 text-zinc-200'}`}
              >
                {flag.enabled ? 'ON' : 'OFF'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {groups.map((group) => (
        <section
          key={group.title}
          className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6"
        >
          <h3 className="text-xl font-semibold text-white">{group.title}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {group.items.map((item) => (
              <div
                key={item.key}
                className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 md:col-span-2"
              >
                <p className="text-sm font-semibold text-zinc-100">{item.label}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">
                      ES
                    </label>
                    <textarea
                      value={settingValue(item.key, 'ES')}
                      onChange={(event) => setSettingValue(item.key, 'ES', event.target.value)}
                      className="h-28 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">
                      CA
                    </label>
                    <textarea
                      value={settingValue(item.key, 'CA')}
                      onChange={(event) => setSettingValue(item.key, 'CA', event.target.value)}
                      className="h-28 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={saveSettings}
            disabled={busy}
            className="mt-5 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-500 disabled:opacity-60"
          >
            {busy ? 'Guardando...' : 'Guardar ajustes'}
          </button>
        </section>
      ))}
    </div>
  );
}
