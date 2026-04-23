import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Aviso legal | Webtense Energy',
  description: 'Información legal básica del titular del sitio y condiciones generales de uso.',
  path: '/aviso-legal',
  locale: 'root',
});

export default function AvisoLegalPage() {
  return (
    <main className="section-shell pb-24">
      <div className="section-inner max-w-4xl">
        <div className="eyebrow">Legal</div>
        <h1 className="section-title mt-5 text-foreground">Aviso legal</h1>
        <div className="surface-panel mt-10 space-y-8 p-8 md:p-10 text-sm leading-7 text-foreground/70">
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Titular
            </h2>
            <p className="mt-3">
              Webtense Energy es el titular del presente sitio web y pone a disposición de los
              usuarios este espacio para información, captación comercial, contenidos y herramientas
              relacionadas con eficiencia energética y domótica.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Condiciones de uso
            </h2>
            <p className="mt-3">
              El acceso al sitio implica la aceptación de un uso lícito, respetuoso y conforme a la
              normativa vigente. Queda prohibido cualquier uso que perjudique el funcionamiento del
              sitio o los derechos de terceros.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Propiedad intelectual
            </h2>
            <p className="mt-3">
              Los contenidos, diseño, estructura, textos, logotipos y elementos gráficos del sitio
              están protegidos por la normativa aplicable y no pueden reutilizarse sin autorización.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Contacto
            </h2>
            <p className="mt-3">
              Para cualquier cuestión legal o comercial relacionada con el sitio puedes escribir a
              `info@webtenseenergy.com`.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
