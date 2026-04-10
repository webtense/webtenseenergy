import { ContactoPage } from "@/components/pages/ContactoPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contacto | Webtense Energy",
  description:
    "Contacta con Webtense Energy para asesoramiento en eficiencia energética, domótica y ahorro en tu factura.",
  path: "/contacto",
  locale: "root",
});

export default function ContactoRoute() {
  return <ContactoPage />;
}
