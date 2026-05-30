'use client';

import React, { useState, useRef, useEffect } from 'react';

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
    businessType: string;
    city: string;
    preferredTime: 'morning' | 'afternoon' | 'anytime';
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
    businessType: '',
    city: '',
    preferredTime: 'anytime',
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
  const [loadedAt, setLoadedAt] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoadedAt(Date.now().toString());
  }, []);

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
      body.set('businessType', formData.contact.businessType || '');
      body.set('city', formData.contact.city || '');
      body.set('preferredTime', formData.contact.preferredTime || 'anytime');
      body.set('website', honeypot);
      body.set('_t', loadedAt);

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

  const buildWhatsAppUrl = (): string => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP ?? '34600000000';
    const businessType = formData.contact.businessType || 'mi negocio';
    const city = formData.contact.city || 'mi zona';
    const message = `Hola, me interesa un estudio energético gratuito para ${businessType} en ${city}.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
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
              <button onClick={handleBack} className="cta-secondary">
                Volver
              </button>
              <button
                onClick={handleNext}
                disabled={formData.method === 'upload' ? !formData.file : !formData.kwConsumed}
                className="cta-primary flex-1"
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
              <button onClick={handleBack} className="cta-secondary">
                Volver
              </button>
              <button onClick={handleNext} className="cta-primary flex-1">
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
              {/* honeypot — no tocar */}
              <input
                name="website"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
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
                  className="input"
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
                    className="input"
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
                    className="input"
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
                  className="input"
                  placeholder="Ej. Iberdrola, Endesa, Repsol..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300">
                  Tipo de negocio
                </label>
                <select
                  value={formData.contact.businessType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, businessType: e.target.value },
                    })
                  }
                  className="input"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Hotel/Hostelería">Hotel / Hostelería</option>
                  <option value="Oficinas/Coworking">Oficinas / Coworking</option>
                  <option value="Comercio/Retail">Comercio / Retail</option>
                  <option value="Industrial/Fábrica">Industrial / Fábrica</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300">
                  Ciudad o provincia
                </label>
                <input
                  type="text"
                  value={formData.contact.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, city: e.target.value },
                    })
                  }
                  className="input"
                  placeholder="Barcelona, Madrid..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 dark:text-zinc-300">
                  Mejor horario para contactar
                </label>
                <select
                  value={formData.contact.preferredTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: {
                        ...formData.contact,
                        preferredTime: e.target.value as 'morning' | 'afternoon' | 'anytime',
                      },
                    })
                  }
                  className="input"
                >
                  <option value="morning">Mañana 9-13h</option>
                  <option value="afternoon">Tarde 15-19h</option>
                  <option value="anytime">Cualquier hora</option>
                </select>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex gap-4 mb-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="cta-secondary disabled:opacity-50"
                  >
                    Volver
                  </button>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 font-bold rounded-2xl px-6 py-3 text-white transition-all"
                    style={{ backgroundColor: 'var(--color-primary-500, #1ab775)' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-foreground/40 dark:text-zinc-600">
                  <hr className="flex-1 border-zinc-200 dark:border-zinc-800" />
                  <span>o contacta directamente</span>
                  <hr className="flex-1 border-zinc-200 dark:border-zinc-800" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 font-bold rounded-2xl px-6 py-3 text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-brand-500, #3b76f6)' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
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
                        aria-hidden="true"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      Solicitar por email
                    </>
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
