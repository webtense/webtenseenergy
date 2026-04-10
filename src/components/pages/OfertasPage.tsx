"use client";

import { useState, useEffect } from "react";

export function OfertasPage() {
  const [ofertasEnabled, setOfertasEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/public/feature-flags")
      .then((res) => res.json())
      .then((data) => setOfertasEnabled(data.ofertas !== false))
      .catch(() => {});
  }, []);

  if (!ofertasEnabled) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Sección en mantenimiento</h1>
          <p className="text-foreground/60">Vuelve pronto.</p>
        </div>
      </div>
    );
  }

  const ofertas = [
    {
      title: "Kit Paneles Solares 400W",
      price: "199,00€",
      oldPrice: "299,00€",
      categoria: "Solar",
      discount: "-33%",
      url: "#",
      icon: "☀️",
    },
    {
      title: "Termostato Inteligente WiFi",
      price: "45,50€",
      oldPrice: "89,99€",
      categoria: "Domótica",
      discount: "-50%",
      url: "#",
      icon: "🌡️",
    },
    {
      title: "Pack 4 Enchufes Inteligentes",
      price: "24,99€",
      oldPrice: "34,99€",
      categoria: "Domótica",
      discount: "-28%",
      url: "#",
      icon: "🔌",
    },
    {
      title: "Medidor Consumo Eléctrico Carril DIN",
      price: "32,15€",
      oldPrice: "45,00€",
      categoria: "Ahorro",
      discount: "-28%",
      url: "#",
      icon: "📊",
    },
  ];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Hero Premium Ofertas */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-transparent">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-100 dark:bg-brand-600/20 blur-[130px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="container relative z-10 mx-auto px-4 text-center mt-10">
          <div className="inline-block px-5 py-2 mb-6 rounded-full bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 backdrop-blur-md shadow-sm dark:shadow-2xl animate-pulse">
            <span className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
              <span>🔥</span> Precios Mínimos Históricos
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
            Chollos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 drop-shadow-sm">Energía</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-foreground/70 dark:text-zinc-300/80 mb-10 leading-relaxed font-light">
            Seleccionamos y verificamos a diario las mejores ofertas en tecnología para el hogar inteligente y componentes de eficiencia energética.
          </p>

          <a
            href="https://t.me/webtenseenergy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex relative group overflow-hidden rounded-full font-bold text-white transition-all shadow-[0_0_30px_rgba(42,171,238,0.3)] bg-[#2AABEE] px-8 py-4"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
              </svg>
              Únete a nuestro Canal de Telegram
            </span>
          </a>
        </div>
      </section>

      {/* Grid de Ofertas */}
      <section className="container mx-auto px-4 py-16 pb-32 relative z-10">
        <h2 className="text-2xl font-bold text-foreground mb-8 border-b border-zinc-200 dark:border-white/10 pb-4">Destacados de hoy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ofertas.map((oferta) => (
            <div
              key={oferta.title}
              className="group flex flex-col bg-white dark:bg-[#0a0f1c] border border-zinc-200 dark:border-white/5 hover:border-brand-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] relative"
            >
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">{oferta.discount}</div>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-zinc-100/80 dark:bg-white/10 backdrop-blur-md text-foreground/80 dark:text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10">
                  {oferta.categoria}
                </div>
              </div>

              <div className="h-48 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-[#0a0f1c] flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                <span className="text-7xl drop-shadow-md dark:drop-shadow-2xl opacity-80">{oferta.icon}</span>
              </div>

              <div className="p-6 flex flex-col flex-1 border-t border-zinc-100 dark:border-white/5 bg-gradient-to-b from-transparent to-zinc-50 dark:to-[#050810]">
                <h3 className="font-bold text-lg text-foreground mb-4 line-clamp-2 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {oferta.title}
                </h3>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <div className="text-foreground/50 dark:text-zinc-500 text-sm line-through decoration-red-500/50 mb-1">{oferta.oldPrice}</div>
                    <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{oferta.price}</div>
                  </div>
                   <a
                     href={oferta.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-md transition-colors group-hover:bg-brand-500 dark:shadow-lg"
                   >
                     <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                     </svg>
                   </a>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
