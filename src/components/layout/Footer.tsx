'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { withBasePath } from '@/lib/paths';

const footerLinks = {
  es: {
    explorar: [
      { name: 'Consultoría Empresas', href: '/empresas' },
      { name: 'Caso Real', href: '/caso-real' },
      { name: 'Estudio Gratuito', href: '/estudio' },
      { name: 'Ahorro Particulares', href: '/particulares' },
      { name: 'Blog de Eficiencia', href: '/blog' },
      { name: 'Sobre nosotros', href: '/sobre-nosotros' },
      { name: 'Checklist energético', href: '/recursos/checklist-energia' },
    ],
    comunidad: [
      { name: 'Ahorro Particulares', href: '/particulares' },
      { name: 'Precio de la luz hoy', href: '/luz/precio-hoy' },
      { name: 'Canal Telegram', href: 'https://t.me/webtenseenergy', external: true },
      { name: 'Chollos y Ofertas', href: '/ofertas' },
    ],
    legal: [
      { name: 'Privacidad', href: '/privacidad' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Aviso Legal', href: '/aviso-legal' },
    ],
    headings: {
      explorar: 'Explorar',
      comunidad: 'Recursos',
      legal: 'Legal',
      footer: 'Todos los derechos reservados.',
    },
    description:
      'Consultoría energética para empresas con facturas superiores a 3.000 €/mes. Resultados medibles, sin obras y sin cambiar de suministrador.',
  },
  ca: {
    explorar: [
      { name: 'Consultoria Empreses', href: '/empresas' },
      { name: 'Cas real', href: '/ca/cas-real' },
      { name: 'Estudi Gratuït', href: '/estudio' },
      { name: "Blog d'Eficiència", href: '/blog' },
      { name: 'Qui som', href: '/sobre-nosotros' },
    ],
    comunidad: [
      { name: 'Ahorro Particulars', href: '/particulares' },
      { name: 'Canal Telegram', href: 'https://t.me/webtenseenergy', external: true },
      { name: 'Contacte Ràpid', href: '/contacto' },
    ],
    legal: [
      { name: 'Privadesa', href: '/privacidad' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Avís Legal', href: '/aviso-legal' },
    ],
    headings: {
      explorar: 'Explorar',
      comunidad: 'Recursos',
      legal: 'Legal',
      footer: 'Tots els drets reservats.',
    },
    description:
      'Consultoria energètica per a empreses amb factures superiors a 3.000 €/mes. Resultats mesurables, sense obres i sense canviar de proveïdor.',
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
            <div className="mt-6 space-y-2 text-sm text-zinc-400">
              <a
                href="mailto:info@webtenseenergy.com"
                className="flex items-center gap-2 hover:text-primary-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                info@webtenseenergy.com
              </a>
              <a
                href="https://wa.me/34691521367"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"></path>
                </svg>
                +34 691 521 367
              </a>
              <p className="text-zinc-500 text-xs pt-1">Webtense Energy · España</p>
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
            &copy; 2026 WEBTENSE ENERGY. {localeLinks.headings.footer}
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
