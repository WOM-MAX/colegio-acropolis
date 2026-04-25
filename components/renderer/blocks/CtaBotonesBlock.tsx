import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type CtaConfig = {
  titulo?: string;
  descripcion?: string;
  textoBoton?: string;
  enlaceBoton?: string;
  estiloBoton?: 'primario' | 'secundario' | 'outline';
  alineacion?: 'left' | 'center' | 'right';
  colorPrimario?: string;
  colorSecundario?: string;
  proporcionColor?: number;
};

export default function CtaBotonesBlock({ configuracion }: { configuracion: CtaConfig }) {
  const {
    titulo = '',
    descripcion = '',
    textoBoton = 'Haz clic aquí',
    enlaceBoton = '#',
    estiloBoton = 'primario',
    alineacion = 'center',
    colorPrimario = '#4a78ed',
    colorSecundario = '#172554',
    proporcionColor = 100
  } = configuracion;

  const btnClasses = {
    // Adapté los colores asumiendo que el fondo será oscuro (Gradient Azul Acrópolis)
    primario: 'bg-white text-azul-acropolis hover:bg-gray-50',
    secundario: 'bg-amarillo text-negro hover:bg-yellow-400', // Texto negro sobre amarillo para legibilidad total
    outline: 'bg-transparent text-white ring-1 ring-white/50 hover:bg-white/10'
  }[estiloBoton];

  const alignmentClass = alineacion === 'center' ? 'text-center items-center' : alineacion === 'right' ? 'text-right items-end' : 'text-left items-start';

  return (
    <section className="py-16 sm:py-24 bg-blanco relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className={`mx-auto flex flex-col ${alignmentClass} px-6 py-16 sm:p-20 lg:max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden`}
          style={{ backgroundImage: `linear-gradient(135deg, ${colorPrimario} ${100 - proporcionColor}%, ${colorSecundario} 100%)` }}
        >
          
          {/* Elementos decorativos estilo Glassmorphism/Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-fucsia/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cian/20 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Patrón sutil para dar textura */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10 flex flex-col w-full">
            {titulo && (
              <div className={`rich-title font-bold tracking-tight text-white [&_h2]:text-3xl [&_h2]:sm:text-5xl [&_h2]:lg:text-6xl [&_h3]:text-2xl [&_h3]:sm:text-4xl [&_h3]:lg:text-5xl [&_h4]:text-xl [&_h4]:sm:text-3xl [&_h4]:lg:text-4xl [&_p]:text-3xl [&_p]:sm:text-5xl [&_p]:lg:text-6xl ${alineacion === 'center' ? 'mx-auto' : alineacion === 'right' ? 'ml-auto' : ''}`}
                  dangerouslySetInnerHTML={{ __html: titulo }} />
            )}
            {descripcion && (
              <div className={`mt-6 text-lg sm:text-xl leading-relaxed text-blue-100 max-w-2xl font-light [&_p]:m-0 ${alineacion === 'center' ? 'mx-auto' : alineacion === 'right' ? 'ml-auto' : ''}`}
                   dangerouslySetInnerHTML={{ __html: descripcion }} />
            )}
            
            <div className={`mt-10 flex items-center gap-x-6 ${alineacion === 'center' ? 'justify-center' : alineacion === 'right' ? 'justify-end' : 'justify-start'}`}>
              <Link
                href={enlaceBoton}
                className={`group flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${btnClasses}`}
              >
                {textoBoton}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
