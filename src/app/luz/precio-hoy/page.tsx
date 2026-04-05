import ElectricityDashboard from '@/components/electricity/ElectricityDashboard';
import Link from 'next/link';

export const metadata = {
  title: 'Precio de la luz hoy | Webtense Energy',
  description: 'Consulta el precio de la luz por horas en tiempo real para optimizar tu ahorro energético.',
};

export default function PrecioLuzHoyPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 bg-background border-b border-zinc-200 dark:border-white/5">
      <div className="container mx-auto px-4">
        {/* Breadcrumb-ish or Back link */}
        <div className="mb-8">
          <Link href="/" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2 transition-colors">
            <span>←</span> Volver a Inicio
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-xl dark:shadow-none shadow-zinc-200/60 border border-zinc-200 dark:border-white/10">
          <ElectricityDashboard />
        </div>

        {/* Informative Footer Section */}
        <div className="mt-12 max-w-4xl mx-auto text-center space-y-4 pt-10">
          <h3 className="text-xl font-bold font-heading text-foreground">¿Cómo ahorrar con el precio de la luz hoy?</h3>
          <p className="text-foreground/70 dark:text-zinc-400 leading-relaxed">
            El precio de la luz varía cada hora según la oferta y la demanda. Utilizar tus electrodomésticos en las horas con precios más bajos (valles) 
            puede suponer un ahorro de hasta el 40% en tu factura mensual. En Webtense Energy te ayudamos a automatizar estos procesos.
          </p>
          <div className="flex justify-center pt-8">
            <Link 
              href="/estudio" 
              className="bg-primary-600 dark:bg-primary-500 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              Solicitar estudio de factura gratis
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
