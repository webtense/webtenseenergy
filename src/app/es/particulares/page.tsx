import { ParticularesPage } from "@/components/pages/ParticularesPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Ahorro Energético en el Hogar | Webtense Energy",
  description:
    "Optimiza tu tarifa, instala autoconsumo solar y reduce tu factura con soluciones de eficiencia para particulares.",
  path: "/particulares",
  locale: "es",
});

export default function ParticularesEsRoute() {
  return <ParticularesPage basePath="/es" />;
}
