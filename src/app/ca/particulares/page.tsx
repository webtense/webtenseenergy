import { ParticularesPage } from "@/components/pages/ParticularesPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Estalvi Energètic a la Llar | Webtense Energy",
  description:
    "Optimitza la teva tarifa, instal·la autoconsum solar i redueix la factura amb solucions d'eficiència per a particulars.",
  path: "/particulares",
  locale: "ca",
});

export default function ParticularesCaRoute() {
  return <ParticularesPage basePath="/ca" />;
}
