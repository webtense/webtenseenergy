'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center font-sans">
        <p className="text-6xl font-bold text-red-500">500</p>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Error crítico</h1>
        <p className="mt-2 text-gray-500 max-w-md">
          La aplicación ha encontrado un error grave. Por favor, recarga la página o vuelve más
          tarde.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          Recargar página
        </button>
      </body>
    </html>
  );
}
