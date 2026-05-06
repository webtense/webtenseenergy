import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Checklist Energético para Empresas | Webtense Energy',
  description: 'Versión imprimible del checklist energético para empresas.',
  path: '/recursos/checklist-energia/imprimir',
  locale: 'root',
});

const checks = [
  {
    section: 'Factura y contrato',
    items: [
      'La factura lleva más de 12 meses sin análisis detallado',
      'No sé cuánto pago en término de potencia vs. término de energía',
      'Aparecen "Excesos de potencia" de forma recurrente en la factura',
      'Las potencias contratadas son iguales en todos los periodos (P1–P6)',
      'No he revisado si mi tarifa actual es la más adecuada para mi perfil de consumo',
    ],
  },
  {
    section: 'Climatización (HVAC)',
    items: [
      'El sistema funciona con horario fijo, no según ocupación real',
      'No hay diferencia de temperatura programada entre zonas ocupadas y vacías',
      'La temperatura se mantiene igual en temporada alta y baja',
      'No sé cuándo fue el último mantenimiento de filtros / carga de gas',
      'No tengo datos de consumo específico del sistema de climatización',
    ],
  },
  {
    section: 'Monitorización y datos',
    items: [
      'Tengo un único contador para todo el negocio (sin subcontadores por zonas)',
      'No recibo alertas de consumo anómalo',
      'No conozco el consumo nocturno ni en festivos con precisión',
      'No dispongo de curva de carga horaria de los últimos 12 meses',
      'El equipo de mantenimiento gestiona equipos sin datos de consumo en tiempo real',
    ],
  },
  {
    section: 'Iluminación y equipos auxiliares',
    items: [
      'La iluminación de zonas comunes está encendida en horas de no uso',
      'No hay sensores de presencia en zonas de uso discontinuo',
      'Los equipos de oficina no tienen gestión de stand-by fuera del horario laboral',
      'No sé cuántos equipos consumen en modo fantasma',
      'La iluminación exterior no se regula según la hora solar',
    ],
  },
];

export default function ChecklistImprimirPage() {
  return (
    <html>
      <head>
        <style>{`
          @page { size: A4; margin: 20mm 18mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: white; }
          .header { border-bottom: 2px solid #16a37f; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .logo { font-size: 16px; font-weight: 900; letter-spacing: -0.5px; }
          .logo span { color: #16a37f; }
          .header-sub { font-size: 9px; color: #888; text-align: right; }
          h1 { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
          .subtitle { font-size: 11px; color: #555; margin-bottom: 20px; line-height: 1.5; }
          .section { margin-bottom: 16px; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #16a37f; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 8px; }
          .item { display: flex; align-items: flex-start; gap: 10px; padding: 7px 8px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 4px; background: #fafafa; }
          .checkbox { width: 14px; height: 14px; border: 1.5px solid #aaa; border-radius: 3px; flex-shrink: 0; margin-top: 1px; }
          .item-text { font-size: 10.5px; line-height: 1.5; color: #333; }
          .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; }
          .footer-note { font-size: 9px; color: #888; max-width: 380px; line-height: 1.5; }
          .footer-cta { font-size: 10px; font-weight: 700; color: #16a37f; text-align: right; }
          .score-box { margin-top: 18px; border: 2px solid #16a37f; border-radius: 8px; padding: 12px 16px; background: #f0fdf7; }
          .score-box p { font-size: 10.5px; line-height: 1.6; color: #1a1a1a; }
          .score-box strong { color: #16a37f; }
          @media print { .no-print { display: none; } }
        `}</style>
      </head>
      <body>
        <div className="header">
          <div>
            <div className="logo">WEBTENSE<span>ENERGY</span></div>
            <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>Consultoría energética para empresas</div>
          </div>
          <div className="header-sub">
            webtenseenergy.com<br />
            Análisis gratuito · 48h · Sin compromiso
          </div>
        </div>

        <h1>Checklist: ¿Tu empresa está pagando energía de más?</h1>
        <p className="subtitle">
          Marca cada punto que aplique a tu situación actual. Si marcas <strong>5 o más</strong>, hay margen de ahorro relevante sin necesidad de grandes inversiones.
        </p>

        {checks.map((section) => (
          <div className="section" key={section.section}>
            <div className="section-title">{section.section}</div>
            {section.items.map((item) => (
              <div className="item" key={item}>
                <div className="checkbox" />
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="score-box">
          <p>
            <strong>¿Has marcado 5 o más puntos?</strong> Envíanos tus últimas 3 facturas en{' '}
            <strong>webtenseenergy.com/estudio</strong>. En 48 horas te decimos exactamente cuánto
            puedes ahorrar y qué medidas tienen más impacto. Gratis, sin compromiso, solo para
            negocios con factura superior a 3.000 €/mes.
          </p>
        </div>

        <div className="footer">
          <div className="footer-note">
            Los resultados dependen del estado inicial de la instalación, contrato, hábitos de consumo y capacidad de automatización. Este checklist es orientativo y no sustituye a un análisis técnico profesional.
          </div>
          <div className="footer-cta">
            webtenseenergy.com/estudio<br />
            <span style={{ fontWeight: 400, color: '#888' }}>info@webtenseenergy.com</span>
          </div>
        </div>
      </body>
    </html>
  );
}
