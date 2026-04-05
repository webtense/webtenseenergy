"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Empresas", href: "/empresas" },
  { name: "Particulares", href: "/particulares" },
  { name: "Precio Luz", href: "/luz/precio-hoy" },
  { name: "Blog", href: "/blog" },
  { name: "Ofertas", href: "/ofertas" },
  { name: "Contacto", href: "/contacto" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading text-xl font-bold tracking-tight text-primary-600 dark:text-primary-500">
              WEBTENSE<span className="text-foreground">ENERGY</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors text-foreground/80 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/estudio"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/25"
          >
            Estudio Gratuito
          </Link>
          <button className="hidden sm:inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-600/25">
            Telegram Deals
          </button>
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
                href={item.href}
                className="text-base font-medium text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
            <Link
              href="/estudio"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md active:scale-95 transition-transform"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Estudio Gratuito
            </Link>
            <button className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md active:scale-95 transition-transform">
              Telegram Deals
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
