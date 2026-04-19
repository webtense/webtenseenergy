"use client";

import { useMemo, useState } from "react";

type TimelineItem = {
  id: string;
  type: string;
  title: string;
  detail: string;
  at: string;
};

type PersonItem = {
  id: string;
  email: string;
  displayName: string;
  phones: string[];
  companies: string[];
  locales: string[];
  sources: string[];
  leadCount: number;
  studyCount: number;
  hasSubscriber: boolean;
  subscriberStatus: "ACTIVE" | "INACTIVE" | "NONE";
  consentedAt: string | null;
  lastActivityAt: string;
  timeline: TimelineItem[];
};

type Props = {
  initialPeople: PersonItem[];
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export function AdminPeoplePanel({ initialPeople }: Props) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialPeople[0]?.id || null);

  const filteredPeople = useMemo(() => initialPeople.filter((person) => [person.displayName, person.email, person.sources.join(" "), person.companies.join(" "), person.phones.join(" ")].join(" ").toLowerCase().includes(search.toLowerCase())), [initialPeople, search]);
  const selectedPerson = filteredPeople.find((person) => person.id === selectedId) || filteredPeople[0] || null;

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Personas</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Vista unificada por email</h2>
            <p className="mt-2 text-sm text-zinc-400">Consolida lead, estudio, newsletter y actividad para leer mejor a cada contacto real.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
            <span className="font-semibold text-white">{initialPeople.length}</span> personas detectadas
          </div>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, email, empresa, fuente o telefono..."
          className="mt-5 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none"
        />
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {filteredPeople.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => setSelectedId(person.id)}
              className={`rounded-2xl border p-4 text-left transition ${selectedPerson?.id === person.id ? "border-primary-500/40 bg-primary-500/10" : "border-white/10 bg-zinc-950 hover:border-white/20"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-100">{person.displayName}</p>
                  <p className="mt-1 text-sm text-zinc-400">{person.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${person.subscriberStatus === "ACTIVE" ? "bg-emerald-500/20 text-emerald-200" : person.subscriberStatus === "INACTIVE" ? "bg-amber-500/20 text-amber-200" : "bg-zinc-700 text-zinc-300"}`}>
                  {person.subscriberStatus}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                {person.sources.map((source) => (
                  <span key={source} className="rounded-full border border-white/10 px-2 py-1">{source}</span>
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-500">Leads {person.leadCount} · Estudios {person.studyCount} · Ultima actividad {formatDate(person.lastActivityAt)}</p>
            </button>
          ))}
        </div>
      </article>

      <aside className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        {selectedPerson ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-primary-400">Ficha</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{selectedPerson.displayName}</h3>
              <p className="mt-1 text-sm text-zinc-400">{selectedPerson.email}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
              <p><strong>Telefonos:</strong> {selectedPerson.phones.join(", ") || "-"}</p>
              <p className="mt-2"><strong>Empresas:</strong> {selectedPerson.companies.join(", ") || "-"}</p>
              <p className="mt-2"><strong>Locales:</strong> {selectedPerson.locales.join(", ") || "-"}</p>
              <p className="mt-2"><strong>Consentimiento:</strong> {formatDate(selectedPerson.consentedAt)}</p>
              <p className="mt-2"><strong>Ultima actividad:</strong> {formatDate(selectedPerson.lastActivityAt)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Timeline</p>
              <div className="mt-3 space-y-3">
                {selectedPerson.timeline.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-zinc-100">{item.title}</p>
                      <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">{item.type}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
                    <p className="mt-2 text-xs text-zinc-500">{formatDate(item.at)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No hay personas que coincidan con la busqueda actual.</p>
        )}
      </aside>
    </section>
  );
}
