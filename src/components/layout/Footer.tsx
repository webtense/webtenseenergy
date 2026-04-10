"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { withBasePath } from "@/lib/paths";

const footerLinks = {
  es: {
    explorar: [
      { name: "Blog de Eficiencia", href: "/blog" },
      { name: "Consultoría Empresas", href: "/empresas" },
      { name: "Ahorro Particulares", href: "/particulares" },
      { name: "Estudio Gratuito", href: "/estudio" },
    ],
    comunidad: [
      { name: "Canal Telegram", href: "https://t.me/webtenseenergy", external: true },
      { name: "Chollos y Ofertas", href: "/ofertas" },
      { name: "Contacto Rápido", href: "/contacto" },
    ],
    legal: [
      { name: "Privacidad", href: "#" },
      { name: "Cookies", href: "#" },
      { name: "Aviso Legal", href: "#" },
    ],
    headings: {
      explorar: "Explorar",
      comunidad: "Comunidad",
      legal: "Legal",
      footer: "Todos los derechos reservados.",
    },
    description:
      "Transformamos la manera en que hogares y empresas consumen energía. Análisis técnicos, domótica avanzada y eficiencia energética real.",
  },
  ca: {
    explorar: [
      { name: "Blog d'Eficiència", href: "/blog" },
      { name: "Consultoria Empreses", href: "/empresas" },
      { name: "Estalvi Particulars", href: "/particulares" },
      { name: "Estudi Gratuit", href: "/estudio" },
    ],
    comunidad: [
      { name: "Canal Telegram", href: "https://t.me/webtenseenergy", external: true },
      { name: "Ofertes i Chollos", href: "/ofertas" },
      { name: "Contacte Ràpid", href: "/contacto" },
    ],
    legal: [
      { name: "Privadesa", href: "#" },
      { name: "Cookies", href: "#" },
      { name: "Avís Legal", href: "#" },
    ],
    headings: {
      explorar: "Explorar",
      comunidad: "Comunitat",
      legal: "Legal",
      footer: "Tots els drets reservats.",
    },
    description:
      "Transformem la manera com llars i empreses consumeixen energia. Anàlisi tècnica, domòtica avançada i eficiència real.",
  },
};

export function Footer() {
  const pathname = usePathname() || "/";
  const locale = pathname.startsWith("/ca") ? "ca" : "es";
  const basePath = pathname.startsWith("/ca") ? "/ca" : pathname.startsWith("/es") ? "/es" : "";
  const localeLinks = footerLinks[locale];

  return (
    <footer className="w-full relative overflow-hidden bg-[#020610] mt-auto">
      {/* Elementos decorativos */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary-900/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link href={withBasePath(basePath, "/")} className="inline-block group">
              <span className="font-heading text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                WEBTENSE<span className="text-primary-500 group-hover:text-primary-400 transition-colors">ENERGY</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-base text-zinc-400 leading-relaxed font-light">
              {localeLinks.description}
            </p>
            <div className="mt-8 flex gap-4">
              <a href="mailto:info@webtenseenergy.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
            <NewsletterForm />
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{localeLinks.headings.explorar}</h3>
            <ul className="space-y-4">
              {localeLinks.explorar.map((item) => (
                <li key={item.name}>
                  <Link href={withBasePath(basePath, item.href)} className="text-sm text-zinc-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary-500/0 group-hover:bg-primary-500 transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{localeLinks.headings.comunidad}</h3>
            <ul className="space-y-4">
              {localeLinks.comunidad.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-brand-500/0 group-hover:bg-brand-500 transition-colors"></span>
                      {item.name}
                    </a>
                  ) : (
                    <Link href={withBasePath(basePath, item.href)} className="text-sm text-zinc-400 hover:text-brand-400 transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-brand-500/0 group-hover:bg-brand-500 transition-colors"></span>
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{localeLinks.headings.legal}</h3>
            <ul className="space-y-4">
              {localeLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-zinc-500 font-light">
            &copy; {new Date().getFullYear()} WEBTENSE ENERGY. {localeLinks.headings.footer}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(26,183,117,1)] relative">
                <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75"></span>
            </span>
            Sistemas Operativos
          </div>
        </div>
      </div>
    </footer>
  );
}
