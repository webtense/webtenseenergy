import { OfertasPage } from "@/components/pages/OfertasPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Ofertas de Energía | Webtense Energy",
  description: "Chollos y ofertas en domótica, autoconsumo y eficiencia energética seleccionados por Webtense Energy.",
  path: "/ofertas",
  locale: "es",
});

export default function OfertasEsRoute() {
  return <OfertasPage />;
}
