import { EmpresasPage } from "@/components/pages/EmpresasPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Consultoría Energética B2B | Webtense Energy",
  description:
    "Soluciones energéticas para empresas. Optimización de contratos, gestión energética y auditorías para reducir costes B2B.",
  path: "/empresas",
  locale: "es",
});

export default function EmpresasEsRoute() {
  return <EmpresasPage basePath="/es" />;
}
