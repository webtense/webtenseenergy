import { EstudioPage } from '@/components/pages/EstudioPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Estudi Energètic Gratuït | Webtense Energy',
  description:
    'Puja la factura de llum o digues quant consumeixes i obtén un estudi energètic personalitzat per estalviar a la llar o negoci.',
  path: '/estudio',
  locale: 'ca',
});

export default function EstudioCaRoute() {
  return <EstudioPage />;
}
