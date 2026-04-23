'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { withBasePath } from '@/lib/paths';

const labels = {
  es: {
    home: 'Inicio',
    blog: 'Blog',
    ofertas: 'Ofertas',
    estudio: 'Estudio',
    contacto: 'Contacto',
  },
  ca: {
    home: 'Inici',
    blog: 'Blog',
    ofertas: 'Ofertes',
    estudio: 'Estudi',
    contacto: 'Contacte',
  },
};

const items = [
  { key: 'home', href: '/', icon: '⌂' },
  { key: 'blog', href: '/blog', icon: '◫' },
  { key: 'ofertas', href: '/ofertas', icon: '⚡' },
  { key: 'estudio', href: '/estudio', icon: '▣' },
  { key: 'contacto', href: '/contacto', icon: '✆' },
];

export function MobileBottomNav() {
  const pathname = usePathname() || '/';
  const locale = pathname.startsWith('/ca') ? 'ca' : 'es';
  const basePath = pathname.startsWith('/ca') ? '/ca' : pathname.startsWith('/es') ? '/es' : '';
  const localeLabels = labels[locale];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] pt-2 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1.5 rounded-[1.8rem] border border-white/10 bg-[#06111d]/88 p-2 shadow-2xl shadow-black/35 backdrop-blur-2xl">
        {items.map((item) => {
          const href = withBasePath(basePath, item.href);
          const isActive =
            pathname === href ||
            (href !== withBasePath(basePath, '/') && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={item.key}
              href={href}
              className={`flex min-h-16 flex-col items-center justify-center rounded-2xl px-1 py-2 text-[11px] font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1">{localeLabels[item.key as keyof typeof localeLabels]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
