import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-azul-acropolis/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fucsia/10 rounded-full blur-[100px]" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-cian/10 rounded-full blur-[80px]" />
      
      <div className="max-w-2xl mx-auto px-4 z-10 text-center">
        <div className="relative inline-block mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-azul-acropolis to-azul-hover" style={{ textShadow: '0 10px 30px rgba(36,58,115,0.1)' }}>
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-4 border-transparent border-t-fucsia border-r-cian rounded-full animate-spin-slow opacity-20 pointer-events-none" style={{ animationDuration: '8s' }} />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-negro mb-6">
          Página no encontrada
        </h2>
        
        <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
          Lo sentimos, la página que estás buscando no existe, ha sido movida o está temporalmente inaccesible.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all bg-azul-acropolis rounded-full shadow-lg shadow-azul-acropolis/30 hover:bg-azul-hover hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
