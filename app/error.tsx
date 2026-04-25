'use client'; 
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí puedes logear el error a un servicio como Sentry o Datadog
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full mx-auto px-4 z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-10 rounded-3xl shadow-xl shadow-red-500/5 text-center">
          
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-negro mb-3">
             Hubo un problema
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Hemos encontrado un error inesperado al cargar esta página. El equipo técnico ha sido notificado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 text-sm font-semibold text-white transition-all bg-azul-acropolis rounded-full shadow-md hover:bg-azul-hover active:scale-95"
            >
               Intentar de nuevo
            </button>
            <Link 
              href="/" 
              className="px-6 py-2.5 text-sm font-semibold text-azul-acropolis transition-all bg-white border border-gray-200 rounded-full shadow-sm hover:border-gray-300 hover:bg-gray-50 active:scale-95"
            >
               Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
