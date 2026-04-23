'use client';

import { useState } from 'react';

type Props = {
  user: {
    username: string;
    role: 'ADMIN' | 'EDITOR';
  };
};

export function AdminTopbar({ user }: Props) {
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-900/90 p-5 shadow-xl shadow-black/10 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Operacion diaria</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Panel de administracion</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Sesion activa: {user.username} ({user.role})
        </p>
      </div>
      <button
        type="button"
        onClick={logout}
        disabled={busy}
        className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-300 disabled:opacity-60"
      >
        {busy ? 'Cerrando...' : 'Cerrar sesion'}
      </button>
    </div>
  );
}
