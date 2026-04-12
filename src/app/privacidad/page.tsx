import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Política de privacidad | Webtense Energy",
  description: "Información sobre tratamiento de datos personales y contacto en Webtense Energy.",
  path: "/privacidad",
  locale: "root",
});

export default function PrivacidadPage() {
  return <LegalShell title="Política de privacidad" intro="Explicamos qué datos recogemos, con qué finalidad y cómo puedes ejercer tus derechos.">
    <LegalSection title="Responsable del tratamiento">
      WEBTENSE ENERGY es responsable del tratamiento de los datos enviados a través de formularios, newsletter y canales directos de contacto del sitio.
    </LegalSection>
    <LegalSection title="Finalidades">
      Utilizamos tus datos para responder consultas, elaborar estudios energéticos, gestionar comunicaciones solicitadas y mantener trazabilidad básica de la relación comercial.
    </LegalSection>
    <LegalSection title="Base jurídica">
      La base jurídica es el consentimiento del usuario al enviar formularios o suscribirse, así como el interés legítimo para atender solicitudes relacionadas con nuestros servicios.
    </LegalSection>
    <LegalSection title="Conservación">
      Conservamos los datos durante el tiempo necesario para atender la solicitud, cumplir obligaciones legales y mantener un historial operativo razonable del servicio.
    </LegalSection>
    <LegalSection title="Derechos">
      Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a `info@webtenseenergy.com`.
    </LegalSection>
  </LegalShell>;
}

function LegalShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="section-shell pb-24">
      <div className="section-inner max-w-4xl">
        <div className="eyebrow">Legal</div>
        <h1 className="section-title mt-5 text-foreground">{title}</h1>
        <p className="section-copy mt-4 max-w-3xl">{intro}</p>
        <div className="surface-panel mt-10 space-y-8 p-8 md:p-10">{children}</div>
      </div>
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-foreground/70">{children}</p>
    </section>
  );
}
