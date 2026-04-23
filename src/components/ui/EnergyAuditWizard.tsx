'use client';

import React, { useState, useRef } from 'react';

type MethodType = 'upload' | 'manual' | null;

interface FormData {
  method: MethodType;
  file: File | null;
  kwConsumed: string;
  habits: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}

const INITIAL_FORM_DATA: FormData = {
  method: null,
  file: null,
  kwConsumed: '',
  habits: [],
  contact: {
    name: '',
    email: '',
    phone: '',
    company: '',
  },
};

const HABIT_OPTIONS = [
  { id: 'trabajo_casa', label: 'Trabajo desde casa', icon: '💻' },
  { id: 'consumo_noche', label: 'Consumo principal de noche', icon: '🌙' },
  { id: 'cocina_electrica', label: 'Cocina y horno eléctrico', icon: '🍳' },
  { id: 'coche_electrico', label: 'Coche eléctrico enchufable', icon: '🚗' },
  { id: 'aerotermia', label: 'Tengo Aerotermia o Bomba de calor', icon: '🌡️' },
  { id: 'frigorificos_extra', label: 'Más de un frigorífico/congelador', icon: '❄️' },
];

export default function EnergyAuditWizard() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const toggleHabit = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      habits: prev.habits.includes(id) ? prev.habits.filter((h) => h !== id) : [...prev.habits, id],
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo supera 5MB. Sube una factura mas ligera.');
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo supera 5MB. Sube una factura mas ligera.');
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const body = new FormData();
      body.set('method', formData.method || 'manual');
      body.set('kwConsumed', formData.kwConsumed || '');
      body.set('habits', JSON.stringify(formData.habits));
      body.set('name', formData.contact.name);
      body.set('email', formData.contact.email);
      body.set('phone', formData.contact.phone);
      body.set('company', formData.contact.company);

      if (formData.file) {
        body.set('invoice', formData.file, formData.file.name);
      }

      const response = await fetch('/api/estudio', {
        method: 'POST',
        body,
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      setStep(5);
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="w-full bg-zinc-50 dark:bg-zinc-950 h-2">
          <div
            className="bg-primary-500 h-2 transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      )}

      <div className="p-8 sm:p-10">
        {/* STEP 1: Selección de Método */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              ¿Cómo prefieres que analicemos tu caso?
            </h2>
            <p className="text-foreground/70 dark:text-zinc-400 mb-8">
              Para ofrecerte la mejor tarifa, necesitamos conocer tu consumo. Puedes subir una
              factura reciente o decirnos tu consumo aproximado.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setFormData({ ...formData, method: 'upload' });
                  handleNext();
                }}
                className="group p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-primary-500 hover:bg-white dark:bg-zinc-900 transition-all text-left relative overflow-hidden flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-foreground font-bold text-lg mb-1">Subir mi factura</h3>
                  <p className="text-sm text-foreground/60 dark:text-zinc-500">
                    La opción más precisa. Analizaremos todos tus datos al instante (PDF o Imagen).
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setFormData({ ...formData, method: 'manual' });
                  handleNext();
                }}
                className="group p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-blue-500 hover:bg-white dark:bg-zinc-900 transition-all text-left relative overflow-hidden flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-foreground font-bold text-lg mb-1">Dato Manual</h3>
                  <p className="text-sm text-foreground/60 dark:text-zinc-500">
                    ¿No tienes la factura a mano? Dinos cuántos kW/h consumes al mes.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Subir archivo o Manual */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {formData.method === 'upload' ? (
              <>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Sube tu factura más reciente
                </h2>
                <p className="text-foreground/70 dark:text-zinc-400 mb-6">
                  Puede ser un archivo PDF, JPG o PNG. Tus datos están seguros y solo los usaremos
                  para analizar tu caso.
                </p>

                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50'
                  } ${formData.file ? 'border-green-500 bg-green-500/5' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                  />
                  {formData.file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="text-foreground font-bold">{formData.file.name}</p>
                        <p className="text-foreground/60 dark:text-zinc-500 text-sm">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, file: null });
                        }}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors mt-2"
                      >
                        Cambiar archivo
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground/70 dark:text-zinc-400 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="text-foreground font-medium">
                          Haz clic aquí para seleccionar o arrastra tu archivo
                        </p>
                        <p className="text-foreground/60 dark:text-zinc-500 text-sm mt-1">
                          PDF, PNG, JPG hasta 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Cuéntanos tu consumo
                </h2>
                <p className="text-foreground/70 dark:text-zinc-400 mb-6">
                  Indícanos cuántos kWh sueles consumir al mes aproximadamente para poder estimar el
                  ahorro.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300 block mb-2">
                      Consumo medio mensual (kWh)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.kwConsumed}
                        onChange={(e) => setFormData({ ...formData, kwConsumed: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 pr-16 text-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-bold"
                        placeholder="Ej. 250"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 dark:text-zinc-500 font-medium">
                        kWh
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-foreground/80 dark:text-zinc-300 font-bold hover:bg-zinc-100 dark:bg-zinc-800 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleNext}
                disabled={formData.method === 'upload' ? !formData.file : !formData.kwConsumed}
                className="flex-1 bg-primary-600 text-foreground font-bold rounded-xl py-3 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente Paso
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Hábitos diarios */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Conoce tus hábitos
            </h2>
            <p className="text-foreground/70 dark:text-zinc-400 mb-6">
              Selecciona las opciones que mejor describan tu día a día en el hogar. Esto nos ayuda a
              recomendarte la tarifa horaria perfecta.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {HABIT_OPTIONS.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    formData.habits.includes(habit.id)
                      ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-2xl">{habit.icon}</span>
                  <span
                    className={`font-medium ${formData.habits.includes(habit.id) ? 'text-primary-400' : 'text-foreground/80 dark:text-zinc-300'}`}
                  >
                    {habit.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-foreground/80 dark:text-zinc-300 font-bold hover:bg-zinc-100 dark:bg-zinc-800 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-primary-600 text-foreground font-bold rounded-xl py-3 hover:bg-primary-500 transition-all"
              >
                Siguiente Paso
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Datos de contacto */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Último paso</h2>
            <p className="text-foreground/70 dark:text-zinc-400 mb-6">
              Déjanos tus datos para que podamos enviarte el estudio personalizado y detallado de tu
              ahorro.
            </p>

            <form onSubmit={submitForm} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, name: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="Ej. María García"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, email: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300">
                    Teléfono Móvil *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, phone: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    placeholder="600 000 000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300">
                  ¿En qué compañía estás ahora? *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact.company}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, company: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="Ej. Iberdrola, Endesa, Repsol..."
                />
              </div>

              <div className="mt-8 flex gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-foreground/80 dark:text-zinc-300 font-bold hover:bg-zinc-100 dark:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 text-foreground font-bold rounded-xl py-3 hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Solicitar Estudio Gratuito'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 5: Success */}
        {step === 5 && (
          <div className="animate-in zoom-in-95 fade-in duration-500 text-center py-8">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              ¡Estudio solicitado con éxito!
            </h2>
            <p className="text-lg text-foreground/70 dark:text-zinc-400 max-w-md mx-auto mb-8">
              Hemos recibido tus datos correctamente. Nuestro equipo de expertos energéticos se
              pondrá a trabajar en tu caso y te contactará muy pronto.
            </p>
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-left max-w-sm mx-auto mb-8">
              <h3 className="font-bold text-foreground mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                Resumen de tu solicitud
              </h3>
              <ul className="space-y-2 text-sm text-foreground/70 dark:text-zinc-400">
                <li>
                  <strong className="text-foreground/80 dark:text-zinc-300">Nombre:</strong>{' '}
                  {formData.contact.name}
                </li>
                <li>
                  <strong className="text-foreground/80 dark:text-zinc-300">Email:</strong>{' '}
                  {formData.contact.email}
                </li>
                <li>
                  <strong className="text-foreground/80 dark:text-zinc-300">Teléfono:</strong>{' '}
                  {formData.contact.phone}
                </li>
                <li>
                  <strong className="text-foreground/80 dark:text-zinc-300">
                    Compañía actual:
                  </strong>{' '}
                  {formData.contact.company}
                </li>
                <li>
                  <strong className="text-foreground/80 dark:text-zinc-300">Análisis vía:</strong>{' '}
                  {formData.method === 'upload'
                    ? 'Archivo de factura'
                    : `${formData.kwConsumed} kWh manual`}
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold rounded-xl px-8 py-3 hover:bg-zinc-700 transition-all"
            >
              Volver al Inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
