'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { APP_VERSION } from '@/lib/app-version';
import { withBasePath } from '@/lib/paths';

const footerLinks = {
  es: {
    explorar: [
      { name: 'Blog de Eficiencia', href: '/blog' },
      { name: 'Consultoría Empresas', href: '/empresas' },
      { name: 'Ahorro Particulares', href: '/particulares' },
      { name: 'Estudio Gratuito', href: '/estudio' },
    ],
    comunidad: [
      { name: 'Canal Telegram', href: 'https://t.me/webtenseenergy', external: true },
      { name: 'Chollos y Ofertas', href: '/ofertas' },
      { name: 'Contacto Rápido', href: '/contacto' },
    ],
    legal: [
      { name: 'Privacidad', href: '/privacidad' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Aviso Legal', href: '/aviso-legal' },
    ],
    headings: {
      explorar: 'Explorar',
      comunidad: 'Comunidad',
      legal: 'Legal',
      footer: 'Todos los derechos reservados.',
    },
    description:
      'Transformamos la manera en que hogares y empresas consumen energía. Análisis técnicos, domótica avanzada y eficiencia energética real.',
  },
  ca: {
    explorar: [
      { name: "Blog d'Eficiència", href: '/blog' },
      { name: 'Consultoria Empreses', href: '/empresas' },
      { name: 'Estalvi Particulars', href: '/particulares' },
      { name: 'Estudi Gratuit', href: '/estudio' },
    ],
    comunidad: [
      { name: 'Canal Telegram', href: 'https://t.me/webtenseenergy', external: true },
      { name: 'Ofertes i Chollos', href: '/ofertas' },
      { name: 'Contacte Ràpid', href: '/contacto' },
    ],
    legal: [
      { name: 'Privadesa', href: '/privacidad' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Avís Legal', href: '/aviso-legal' },
    ],
    headings: {
      explorar: 'Explorar',
      comunidad: 'Comunitat',
      legal: 'Legal',
      footer: 'Tots els drets reservats.',
    },
    description:
      'Transformem la manera com llars i empreses consumeixen energia. Anàlisi tècnica, domòtica avançada i eficiència real.',
  },
};

export function Footer() {
  const pathname = usePathname() || '/';
  const locale = pathname.startsWith('/ca') ? 'ca' : 'es';
  const basePath = pathname.startsWith('/ca') ? '/ca' : pathname.startsWith('/es') ? '/es' : '';
  const localeLinks = footerLinks[locale];
  const [description, setDescription] = useState(localeLinks.description);

  useEffect(() => {
    fetch(`/api/public/site-settings?locale=${locale}`)
      .then((res) => res.json())
      .then((data: { settings?: Array<{ key: string; value: string }> }) => {
        const next = data.settings?.find((item) =>
          item.key.startsWith('footer.description:')
        )?.value;
        if (next) setDescription(next);
      })
      .catch(() => {});
  }, [locale]);

  return (
    <footer className="relative mt-auto overflow-hidden bg-[#04111b] text-white">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
      <div className="absolute -top-20 left-[12%] h-72 w-72 rounded-full bg-primary-500/12 blur-[110px]"></div>
      <div className="absolute bottom-0 right-[10%] h-80 w-80 rounded-full bg-brand-500/12 blur-[120px]"></div>

      <div className="section-inner relative z-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link href={withBasePath(basePath, '/')} className="inline-block group">
              <span className="font-heading text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                WEBTENSE
                <span className="text-primary-500 group-hover:text-primary-400 transition-colors">
                  ENERGY
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-base text-zinc-400 leading-relaxed font-light">
              {description}
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href="mailto:info@webtenseenergy.com"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>
            <NewsletterForm />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              {localeLinks.headings.explorar}
            </h3>
            <ul className="space-y-4">
              {localeLinks.explorar.map((item) => (
                <li key={item.name}>
                  <Link
                    href={withBasePath(basePath, item.href)}
                    className="text-sm text-zinc-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-500/0 group-hover:bg-primary-500 transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              {localeLinks.headings.comunidad}
            </h3>
            <ul className="space-y-4">
              {localeLinks.comunidad.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-brand-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-500/0 group-hover:bg-brand-500 transition-colors"></span>
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={withBasePath(basePath, item.href)}
                      className="text-sm text-zinc-400 hover:text-brand-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-500/0 group-hover:bg-brand-500 transition-colors"></span>
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              {localeLinks.headings.legal}
            </h3>
            <ul className="space-y-4">
              {localeLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-zinc-500 font-light">
            &copy; 2026 WEBTENSE ENERGY. {localeLinks.headings.footer} · v{APP_VERSION}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(26,183,117,1)] relative">
              <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75"></span>
            </span>
            Plataforma operativa
          </div>
        </div>
      </div>
    </footer>
  );
}
