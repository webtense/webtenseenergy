"use client";

import { useMemo, useState } from "react";

type FeatureFlag = {
  id: string;
  key: string;
  enabled: boolean;
  description: string | null;
};

type SiteSetting = {
  id: string;
  key: string;
  value: string;
  locale: "ES" | "CA" | null;
};

type Props = {
  user: {
    username: string;
    role: "ADMIN" | "EDITOR";
  };
  flags: FeatureFlag[];
  settings: SiteSetting[];
};

export function AdminDashboard({ user, flags, settings }: Props) {
  const [localFlags, setLocalFlags] = useState(flags);
  const [localSettings, setLocalSettings] = useState(settings);
  const [status, setStatus] = useState<string>("");

  const heroES = useMemo(
    () => localSettings.find((item) => item.key === "home.hero.title:ES")?.value || "",
    [localSettings],
  );
  const heroCA = useMemo(
    () => localSettings.find((item) => item.key === "home.hero.title:CA")?.value || "",
    [localSettings],
  );

  const setHeroValue = (key: "home.hero.title:ES" | "home.hero.title:CA", value: string) => {
    setLocalSettings((prev) =>
      prev.map((item) => {
        if (item.key === key) return { ...item, value };
        return item;
      }),
    );
  };

  const toggleFlag = async (flag: FeatureFlag) => {
    const nextEnabled = !flag.enabled;
    setLocalFlags((prev) => prev.map((item) => (item.id === flag.id ? { ...item, enabled: nextEnabled } : item)));

    const response = await fetch("/api/admin/feature-flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: flag.key, enabled: nextEnabled }),
    });

    if (!response.ok) {
      setLocalFlags((prev) => prev.map((item) => (item.id === flag.id ? { ...item, enabled: flag.enabled } : item)));
      setStatus("No se pudo guardar el modulo.");
      return;
    }

    setStatus(`Modulo ${flag.key} ${nextEnabled ? "activado" : "desactivado"}.`);
  };

  const saveHeroTitles = async () => {
    const response = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { key: "home.hero.title", locale: "ES", value: heroES },
          { key: "home.hero.title", locale: "CA", value: heroCA },
        ],
      }),
    });

    if (!response.ok) {
      setStatus("No se pudieron guardar los textos.");
      return;
    }

    setStatus("Textos del hero guardados correctamente.");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Backoffice</p>
            <h1 className="mt-2 text-3xl font-bold">Panel de control</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Sesion: {user.username} ({user.role})
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-300"
          >
            Cerrar sesion
          </button>
        </div>

        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">Modulos</h2>
          <p className="mt-1 text-sm text-zinc-400">Activa o desactiva blog, ofertas, newsletter y telegram.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {localFlags.map((flag) => (
              <button
                key={flag.id}
                type="button"
                onClick={() => toggleFlag(flag)}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-left hover:border-primary-500"
              >
                <div>
                  <p className="font-semibold">{flag.key}</p>
                  <p className="text-xs text-zinc-500">{flag.description || "Sin descripcion"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${flag.enabled ? "bg-primary-600 text-white" : "bg-zinc-700"}`}>
                  {flag.enabled ? "ON" : "OFF"}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">Texto principal home</h2>
          <p className="mt-1 text-sm text-zinc-400">Edicion inicial del titulo hero por idioma.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-400">Castellano (ES)</label>
              <textarea
                value={heroES}
                onChange={(event) => setHeroValue("home.hero.title:ES", event.target.value)}
                className="h-24 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-400">Catala (CA)</label>
              <textarea
                value={heroCA}
                onChange={(event) => setHeroValue("home.hero.title:CA", event.target.value)}
                className="h-24 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={saveHeroTitles}
            className="mt-4 rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-500"
          >
            Guardar textos
          </button>
        </section>

        {status && <p className="rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm">{status}</p>}
      </div>
    </div>
  );
}
