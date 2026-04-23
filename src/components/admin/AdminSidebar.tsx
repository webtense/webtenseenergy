'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation } from '@/lib/admin-navigation';

type Props = {
  role: 'ADMIN' | 'EDITOR';
};

export function AdminSidebar({ role }: Props) {
  const pathname = usePathname() || '/admin';
  const items = adminNavigation.filter((item) => !item.adminOnly || role === 'ADMIN');

  return (
    <aside className="rounded-3xl border border-white/10 bg-zinc-900/90 p-4 shadow-2xl shadow-black/20 lg:sticky lg:top-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-5">
        <p className="text-xs uppercase tracking-[0.22em] text-primary-400">Webtense v3.1</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Backoffice</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Gestion centralizada de contenido, contactos, envios y operacion.
        </p>
      </div>
      <nav className="mt-4 space-y-2">
        {items.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl border px-4 py-3 transition ${
                active
                  ? 'border-primary-500/50 bg-primary-500/10 text-white'
                  : 'border-white/10 bg-zinc-950 text-zinc-300 hover:border-white/20 hover:text-white'
              }`}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.description}</p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
