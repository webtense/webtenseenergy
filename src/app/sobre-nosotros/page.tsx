import { buildPageMetadata } from '@/lib/seo';
import { SobreNosotrosPage } from '@/components/pages/SobreNosotrosPage';

export const metadata = buildPageMetadata({
  title: 'Sobre Nosotros | Webtense Energy - Consultoría Energética Independiente',
  description:
    'Consultoría energética independiente para empresas. No vendemos energía: analizamos tu consumo, identificamos el ahorro real y lo verificamos mes a mes. Sin comisiones, sin letra pequeña.',
  path: '/sobre-nosotros',
  locale: 'root',
});

export default function SobreNosotrosRoute() {
  return <SobreNosotrosPage basePath="" lang="es" />;
}
