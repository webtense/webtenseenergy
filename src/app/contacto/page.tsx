"use client";

import React, { useState } from "react";

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorError, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    // Obtener los datos del formulario
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al enviar. Inténtalo de nuevo.");
      }
    } catch {
      setError("Error de red. Asegúrate de tener conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Premium */}
      <section className="relative py-24 overflow-hidden border-b border-zinc-200 dark:border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-transparent to-brand-50/50 dark:from-primary-900/40 dark:via-background dark:to-brand-900/20 opacity-80 dark:opacity-50 blur-3xl pointer-events-none"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest shadow-sm dark:shadow-lg">
            Estamos aquí para ti
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl font-extrabold text-foreground mb-6 tracking-tight drop-shadow-sm">
            Contacta con <span className="text-primary-600 dark:text-primary-500">Nosotros</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/70 dark:text-zinc-300/80 leading-relaxed font-light">
            Soluciones energéticas personalizadas. Resuelve tus dudas, solicita presupuesto o empieza a ahorrar hoy mismo.
          </p>
        </div>
      </section>

      {/* Main Content con Glassmorphism */}
      <section className="pb-32 pt-10 container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Info Side */}
          <div className="md:col-span-2 space-y-8">
            <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-xl shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-500/20 blur-3xl rounded-full"></div>
              
              <h2 className="font-heading text-3xl font-bold mb-8 text-foreground relative">Hablemos</h2>
              
              <div className="space-y-8 relative">
                {/* Phone */}
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-500/20 dark:to-primary-600/5 border border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 shrink-0 group-hover:scale-110 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/30 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(26,183,117,0.1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">WhatsApp / Teléfono</h3>
                    <a href="https://wa.me/34691521367" target="_blank" rel="noopener noreferrer" className="text-foreground/60 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mt-1 block">
                      +34 691 521 367
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-600/5 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/30 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Email Directo</h3>
                    <a href="mailto:info@webtenseenergy.com" className="text-foreground/60 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-1 block">
                      info@webtenseenergy.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50/80 dark:from-primary-900/40 to-transparent border-l-4 border-primary-500 p-6 rounded-r-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="text-amber-500 dark:text-yellow-400 animate-pulse">⚡</span> Respuesta Rápida garantizada
              </h3>
              <p className="text-sm text-foreground/70 dark:text-zinc-400 leading-relaxed">
                Contactando a través del formulario o WhatsApp, nuestro equipo especializado analizará tu caso y te responderá en un plazo máximo de 24 horas laborales.
              </p>
            </div>
          </div>

          {/* Form Side - Ahora 100% Funcional con la API */}
          <div className="md:col-span-3">
            <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl backdrop-blur-xl shadow-sm dark:shadow-2xl relative">
              <h2 className="font-heading text-2xl font-bold mb-8 text-foreground">Envíanos un mensaje</h2>
              
              {isSuccess ? (
                <div className="bg-emerald-50 dark:bg-green-500/10 border border-emerald-200 dark:border-green-500/30 rounded-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-emerald-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-foreground/70 dark:text-zinc-400 mb-6">Hemos recibido tu consulta correctamente. Te contactaremos pronto.</p>
                  <button onClick={() => setIsSuccess(false)} className="px-6 py-3 bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 text-foreground dark:text-white rounded-full transition font-medium">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorError && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                      {errorError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Nombre completo</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        className="w-full bg-white dark:bg-[#030712] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-inner"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Teléfono</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        className="w-full bg-white dark:bg-[#030712] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-inner"
                        placeholder="Ej. +34 600 000 000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Correo electrónico</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required
                      className="w-full bg-white dark:bg-[#030712] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-inner"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Asunto</label>
                    <div className="relative">
                      <select 
                        id="subject" 
                        name="subject"
                        className="w-full bg-white dark:bg-[#030712] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all appearance-none shadow-sm dark:shadow-inner"
                      >
                        <option value="Información general">Información general</option>
                        <option value="Consultoría B2B">Consultoría B2B</option>
                        <option value="Ahorro Particulares">Ahorro Particulares / Solar</option>
                        <option value="Domótica">Proyectos de Domótica</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50 dark:text-zinc-500">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Mensaje</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      required
                      rows={5}
                      className="w-full bg-white dark:bg-[#030712] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 resize-none shadow-sm dark:shadow-inner"
                      placeholder="¿En qué podemos ayudarte?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group overflow-hidden bg-primary-600 text-white font-bold rounded-xl py-4 hover:bg-primary-500 active:scale-[0.98] transition-all shadow-md dark:shadow-[0_0_20px_rgba(26,183,117,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}</span>
                      {!isSubmitting && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      )}
                    </div>
                  </button>
                  
                  <p className="text-xs text-foreground/50 dark:text-zinc-500 text-center mt-4 pt-2">
                    Tus datos están seguros y serán tratados de acuerdo con la RGPD europea.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
