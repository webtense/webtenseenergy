"use client";

import { FormEvent, useState, useEffect } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [copy, setCopy] = useState({
    title: "Boletin Webtense",
    subtitle:
      "Recibe ideas practicas sobre ahorro, precio de la luz, domotica y recomendaciones seleccionadas. Sin ruido y con baja en un clic.",
    legal: "Acepto recibir comunicaciones de Webtense Energy y puedo darme de baja en cualquier momento.",
  });

  useEffect(() => {
    const locale = window.location.pathname.startsWith("/ca") ? "ca" : "es";

    fetch("/api/public/feature-flags")
      .then(res => res.json())
      .then(data => setNewsletterEnabled(data.newsletter === true))
      .catch(() => {});

    fetch(`/api/public/site-settings?locale=${locale}`)
      .then((res) => res.json())
      .then((data: { settings?: Array<{ key: string; value: string }> }) => {
        const settings = data.settings || [];
        setCopy({
          title: settings.find((item) => item.key.startsWith("newsletter.title:"))?.value || "Boletin Webtense",
          subtitle:
            settings.find((item) => item.key.startsWith("newsletter.subtitle:"))?.value ||
            "Recibe ideas practicas sobre ahorro, precio de la luz, domotica y recomendaciones seleccionadas. Sin ruido y con baja en un clic.",
          legal:
            settings.find((item) => item.key.startsWith("newsletter.legal:"))?.value ||
            "Acepto recibir comunicaciones de Webtense Energy y puedo darme de baja en cualquier momento.",
        });
      })
      .catch(() => {});
  }, []);

  if (!newsletterEnabled) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!consent) {
      setStatus("error");
      setMessage("Debes aceptar la politica para suscribirte.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, consent }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "No se pudo completar la suscripcion.");
      }

      setStatus("ok");
      setMessage(payload.message || "Suscripcion completada.");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo completar la suscripcion.");
    }
  };

  return (
    <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">{copy.title}</p>
      <p className="mt-2 text-sm text-zinc-300">
        {copy.subtitle}
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className="w-full rounded-xl border border-white/10 bg-[#020610] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none"
        />
        <label className="flex items-start gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-900"
          />
          {copy.legal}
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-500 disabled:opacity-60"
        >
          {status === "loading" ? "Suscribiendo..." : "Quiero recibirlo"}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-xs ${status === "ok" ? "text-primary-300" : "text-red-300"}`}>{message}</p>
      )}
    </div>
  );
}
