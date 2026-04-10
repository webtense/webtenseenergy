"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { withBasePath } from "@/lib/paths";

const navigation = [
  { key: "empresas", href: "/empresas" },
  { key: "particulares", href: "/particulares" },
  { key: "precio", href: "/luz/precio-hoy" },
  { key: "blog", href: "/blog" },
  { key: "ofertas", href: "/ofertas" },
  { key: "contacto", href: "/contacto" },
];

const labels = {
  es: {
    empresas: "Empresas",
    particulares: "Particulares",
    precio: "Precio Luz",
    blog: "Blog",
    ofertas: "Ofertas",
    contacto: "Contacto",
    estudio: "Estudio Gratuito",
    telegram: "Telegram Deals",
  },
  ca: {
    empresas: "Empreses",
    particulares: "Particulars",
    precio: "Preu Llum",
    blog: "Blog",
    ofertas: "Ofertes",
    contacto: "Contacte",
    estudio: "Estudi Gratuit",
    telegram: "Telegram Deals",
  },
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "/";
  const locale = pathname.startsWith("/ca") ? "ca" : "es";
  const basePath = pathname.startsWith("/ca") ? "/ca" : pathname.startsWith("/es") ? "/es" : "";
  const localeLabels = labels[locale];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href={withBasePath(basePath, "/")} className="flex items-center space-x-2">
            <span className="font-heading text-xl font-bold tracking-tight text-primary-600 dark:text-primary-500">
              WEBTENSE<span className="text-foreground">ENERGY</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={withBasePath(basePath, item.href)}
                className="transition-colors text-foreground/80 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {localeLabels[item.key as keyof typeof localeLabels]}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={withBasePath(basePath, "/estudio")}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/25"
          >
            {localeLabels.estudio}
          </Link>
          <Link
            href="https://t.me/webtenseenergy"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-600/25"
          >
            {localeLabels.telegram}
          </Link>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-white/10 bg-background px-4 py-4 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={withBasePath(basePath, item.href)}
                className="text-base font-medium text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {localeLabels[item.key as keyof typeof localeLabels]}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
            <Link
              href={withBasePath(basePath, "/estudio")}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md active:scale-95 transition-transform"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {localeLabels.estudio}
            </Link>
            <Link
              href="https://t.me/webtenseenergy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md active:scale-95 transition-transform"
            >
              {localeLabels.telegram}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
