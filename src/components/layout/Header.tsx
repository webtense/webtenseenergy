'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { withBasePath } from '@/lib/paths';

const navigation = [
  { key: 'empresas', href: '/empresas' },
  { key: 'casoReal', href: '/caso-real' },
  { key: 'blog', href: '/blog' },
  { key: 'contacto', href: '/contacto' },
];

const labels = {
  es: {
    empresas: 'Empresas',
    casoReal: 'Caso real',
    particulares: 'Particulares',
    precio: 'Precio luz',
    blog: 'Blog',
    contacto: 'Contacto',
    estudio: 'Estudio gratuito',
    telegram: 'Canal Telegram',
  },
  ca: {
    empresas: 'Empreses',
    casoReal: 'Cas real',
    particulares: 'Particulars',
    precio: 'Preu llum',
    blog: 'Blog',
    contacto: 'Contacte',
    estudio: 'Estudi gratuit',
    telegram: 'Canal Telegram',
  },
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname() || '/';
  const locale = pathname.startsWith('/ca') ? 'ca' : 'es';
  const basePath = pathname.startsWith('/ca') ? '/ca' : pathname.startsWith('/es') ? '/es' : '';
  const localeLabels = labels[locale];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-background/85 backdrop-blur-xl dark:border-white/8">
      <div className="section-inner flex h-16 items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href={withBasePath(basePath, '/')} className="flex items-center gap-2">
            <span className="font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
              WEBTENSE<span className="text-primary-600 dark:text-primary-400">ENERGY</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-foreground/65">
            {navigation.map((item) => {
              const href = withBasePath(basePath, item.href);
              const isActive =
                pathname === href ||
                (href !== withBasePath(basePath, '/') && pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={
                    isActive
                      ? 'text-foreground'
                      : 'transition-colors hover:text-primary-600 dark:hover:text-primary-400'
                  }
                >
                  {localeLabels[item.key as keyof typeof localeLabels]}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://wa.me/34691521367"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/55 transition hover:text-primary-600 dark:hover:text-primary-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"></path>
            </svg>
            +34 691 521 367
          </a>
          <Link
            href={withBasePath(basePath, '/estudio')}
            className="cta-primary text-sm px-5 py-2.5"
          >
            {localeLabels.estudio}
          </Link>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200/90 bg-white/80 text-foreground shadow-sm transition active:scale-95 lg:hidden dark:border-white/10 dark:bg-white/5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7h16M4 12h16m-16 5h10"
              />
            </svg>
          )}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-zinc-200 bg-background/95 px-4 pb-6 pt-4 shadow-2xl backdrop-blur-xl lg:hidden dark:border-white/8">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="surface-panel-soft p-3">
              <nav className="grid gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={withBasePath(basePath, item.href)}
                    className="rounded-2xl px-4 py-3 text-base font-semibold text-foreground/80 transition hover:bg-zinc-100 hover:text-primary-600 dark:hover:bg-white/5 dark:hover:text-primary-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {localeLabels[item.key as keyof typeof localeLabels]}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={withBasePath(basePath, '/estudio')}
                className="cta-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {localeLabels.estudio}
              </Link>
              <Link
                href="https://t.me/webtenseenergy"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                {localeLabels.telegram}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
