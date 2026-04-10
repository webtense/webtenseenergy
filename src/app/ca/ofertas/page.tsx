import { OfertasPage } from "@/components/pages/OfertasPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Ofertes d'Energia | Webtense Energy",
  description: "Ofertes en domòtica, autoconsum i eficiència energètica seleccionades per Webtense Energy.",
  path: "/ofertas",
  locale: "ca",
});

export default function OfertasCaRoute() {
  return <OfertasPage />;
}
