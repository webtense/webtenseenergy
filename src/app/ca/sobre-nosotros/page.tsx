import { buildPageMetadata } from '@/lib/seo';
import { SobreNosotrosPage } from '@/components/pages/SobreNosotrosPage';

export const metadata = buildPageMetadata({
  title: 'Sobre Nosaltres | Webtense Energy - Consultoria Energètica Independent',
  description:
    "Consultoria energètica independent per a empreses. No venem energia: analitzem el teu consum, identifiquem l'estalvi real i el verifiquem mes a mes. Sense comissions, sense lletra petita.",
  path: '/sobre-nosotros',
  locale: 'ca',
});

export default function SobreNosaltresCaRoute() {
  return <SobreNosotrosPage basePath="/ca" lang="ca" />;
}
