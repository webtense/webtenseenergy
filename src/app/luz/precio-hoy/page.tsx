import { PrecioLuzHoyPage } from '@/components/pages/PrecioLuzHoyPage';
import { buildFAQSchema, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Precio de la luz hoy por horas | PVPC en tiempo real',
  description:
    'Consulta el precio de la luz hoy por franjas horarias (PVPC). Descubre cuándo está más barata la electricidad y cuándo conviene poner la lavadora, el lavavajillas o cargar el coche eléctrico.',
  path: '/luz/precio-hoy',
  locale: 'root',
});

const FAQ_ITEMS = [
  {
    question: '¿Cuándo está más barata la luz hoy?',
    answer:
      'En general, la electricidad es más barata en los tramos de baja demanda: de madrugada (entre las 0:00 y las 8:00) y a mediodía (13:00-15:00). Sin embargo, el precio varía cada día según la oferta y la demanda en el mercado mayorista. Consulta la gráfica de tramos horarios para ver los precios exactos del día de hoy en tiempo real.',
  },
  {
    question: '¿Qué es el precio PVPC de la electricidad?',
    answer:
      'El PVPC (Precio Voluntario para el Pequeño Consumidor) es la tarifa regulada de electricidad en España. Su precio varía cada hora en función del mercado mayorista (pool eléctrico). Los consumidores con tarifa PVPC pagan exactamente el precio del mercado en cada tramo horario, más los cargos fijos de red e impuestos.',
  },
  {
    question: '¿Merece la pena la tarifa de luz por horas?',
    answer:
      'Si tienes flexibilidad para desplazar consumos (lavadora, lavavajillas, carga del coche eléctrico o de la batería doméstica) a las horas más baratas, la tarifa horaria PVPC puede suponer un ahorro de entre el 15% y el 30% respecto a una tarifa fija. Es especialmente rentable con vehículo eléctrico, aerotermia o bomba de calor.',
  },
  {
    question: '¿Cómo funciona el precio del pool eléctrico en España?',
    answer:
      'El precio del pool es el precio mayorista de la electricidad fijado cada hora en el mercado ibérico (MIBEL) según la oferta (centrales de generación) y la demanda (consumo total). En una factura PVPC, entre el 35% y el 50% del coste proviene del precio del pool; el resto son cargos regulados de red, impuestos y el término de potencia.',
  },
  {
    question: '¿Cuándo conviene poner la lavadora para ahorrar en la factura?',
    answer:
      'Para ahorrar en la factura de la luz, lo ideal es poner la lavadora en las horas valles: de 0:00 a 8:00 de la madrugada o entre las 13:00 y las 15:00 del mediodía. Si tu tarifa es PVPC, consulta el precio horario en tiempo real para encontrar el tramo más económico del día concreto.',
  },
];

const faqSchema = buildFAQSchema(FAQ_ITEMS);

export default function PrecioLuzHoyRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PrecioLuzHoyPage basePath="" faqItems={FAQ_ITEMS} />
    </>
  );
}
