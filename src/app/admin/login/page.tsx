'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message || 'No se pudo iniciar sesion.');
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesion.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-[80vh] bg-zinc-950 px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
          Backoffice
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">Acceso administrador</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Gestiona modulos, contenido, blog y newsletter.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Email o usuario</label>
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none"
              placeholder="admin@webtenseenergy.com"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white transition hover:bg-primary-500 disabled:opacity-60"
          >
            {status === 'loading' ? 'Entrando...' : 'Entrar'}
          </button>
          {message && <p className="text-sm text-red-300">{message}</p>}
        </form>
      </div>
    </div>
  );
}
