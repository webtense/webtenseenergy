import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Política de cookies | Webtense Energy",
  description: "Información sobre uso de cookies y tecnologías similares en Webtense Energy.",
  path: "/cookies",
  locale: "root",
});

export default function CookiesPage() {
  return (
    <main className="section-shell pb-24">
      <div className="section-inner max-w-4xl">
        <div className="eyebrow">Legal</div>
        <h1 className="section-title mt-5 text-foreground">Política de cookies</h1>
        <div className="surface-panel mt-10 space-y-8 p-8 md:p-10 text-sm leading-7 text-foreground/70">
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Qué son</h2>
            <p className="mt-3">Las cookies son pequeños archivos que permiten recordar información básica de navegación, preferencias o medición del uso del sitio.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Qué usamos</h2>
            <p className="mt-3">Utilizamos cookies y tecnologías similares para funcionamiento técnico, analítica básica, seguridad y mejora de la experiencia cuando proceda.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Cómo gestionarlas</h2>
            <p className="mt-3">Puedes bloquear o eliminar cookies desde la configuración de tu navegador. Ten en cuenta que algunas funciones del sitio pueden dejar de comportarse correctamente.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
